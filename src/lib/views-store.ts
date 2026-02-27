/**
 * Pluggable storage adapter for page view counts.
 *
 * Resolves at runtime based on available env vars:
 *   1. UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN → Upstash Redis
 *   2. VIEWS_KV_NAMESPACE (bound via wrangler / CF Pages)  → Cloudflare KV
 *   3. Neither configured → fallback (returns 0, logs warning)
 */

export interface ViewsStore {
	increment(slug: string): Promise<number>
}

// ── Upstash Redis ──────────────────────────────────────────────

class UpstashStore implements ViewsStore {
	private url: string
	private token: string

	constructor(url: string, token: string) {
		this.url = url.replace(/\/$/, '')
		this.token = token
	}

	async increment(slug: string): Promise<number> {
		const res = await fetch(`${this.url}/incr/views:${slug}`, {
			headers: { Authorization: `Bearer ${this.token}` },
		})
		if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
		const json = (await res.json()) as { result: number }
		return json.result
	}
}

// ── Cloudflare KV ──────────────────────────────────────────────

class CloudflareKVStore implements ViewsStore {
	private kv: KVNamespace

	constructor(kv: KVNamespace) {
		this.kv = kv
	}

	async increment(slug: string): Promise<number> {
		const key = `views:${slug}`
		const current = parseInt((await this.kv.get(key)) ?? '0', 10)
		const next = current + 1
		await this.kv.put(key, String(next))
		return next
	}
}

// ── Fallback (not configured) ──────────────────────────────────

class FallbackStore implements ViewsStore {
	private warned = false

	async increment(_slug: string): Promise<number> {
		if (!this.warned) {
			console.warn(
				'[views] No storage configured. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, ' +
					'or bind VIEWS_KV_NAMESPACE for Cloudflare KV. Returning 0.'
			)
			this.warned = true
		}
		return 0
	}
}

// ── Factory ────────────────────────────────────────────────────

let _store: ViewsStore | undefined

export function getViewsStore(platform?: App.Platform): ViewsStore {
	if (_store) return _store

	const upstashUrl = import.meta.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_URL
	const upstashToken =
		import.meta.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

	if (upstashUrl && upstashToken) {
		_store = new UpstashStore(upstashUrl, upstashToken)
		return _store
	}

	const kv = (platform as any)?.env?.VIEWS_KV_NAMESPACE as KVNamespace | undefined
	if (kv) {
		_store = new CloudflareKVStore(kv)
		return _store
	}

	_store = new FallbackStore()
	return _store
}
