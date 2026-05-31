(function () {
  const OPTIONS = [
    { key: 'powerpoint',    label: 'PowerPoint' },
    { key: 'latex',         label: 'LaTeX' },
    { key: 'canva',         label: 'Canva' },
    { key: 'illustrator',   label: 'Adobe Illustrator' },
    { key: 'affinity',      label: 'Affinity' },
    { key: 'tablet-carved', label: 'Carved tablet' },
    { key: 'other',         label: 'Other' },
  ]

  // Retina-burning poster colours (all distinct)
  const COLORS = ['#E52020','#1FAA1F','#00C8FF','#1A1A8F','#B8B820','#FF8C00','#CC44CC']

  const STORAGE_KEY = 'poll:poster-tools:voted'

  function drawPie(counts) {
    const canvas = document.getElementById('poll-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    const total = OPTIONS.reduce((s, o) => s + (counts[o.key] || 0), 0)

    ctx.clearRect(0, 0, W, H)

    // Title — Times New Roman, slightly too big
    ctx.font = 'bold 16px "Times New Roman", serif'
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText('Fig. 1.  Poster tool preferences (preliminary results, n=' + total + ')', W / 2, 22)

    if (total === 0) {
      ctx.font = '14px Arial'
      ctx.fillText('No votes yet', W / 2, H / 2)
      return
    }

    const cx = W * 0.36
    const cy = H * 0.55
    const r  = Math.min(W * 0.34, H * 0.42)
    const SHADOW = 7

    // 3D shadow (just a grey offset layer beneath)
    let angle = -Math.PI / 2
    OPTIONS.forEach(function(o) {
      const count = counts[o.key] || 0
      if (!count) return
      const sweep = (count / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy + SHADOW)
      ctx.arc(cx, cy + SHADOW, r, angle, angle + sweep)
      ctx.closePath()
      ctx.fillStyle = '#666'
      ctx.fill()
      angle += sweep
    })

    // Pie segments
    angle = -Math.PI / 2
    OPTIONS.forEach(function(o, i) {
      const count = counts[o.key] || 0
      if (!count) return
      const sweep = (count / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, angle, angle + sweep)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
      angle += sweep
    })

    // Legend — crammed, ugly border
    const lx = W * 0.66
    let   ly = H * 0.14
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.strokeRect(lx - 6, ly - 18, W - lx + 2, OPTIONS.length * 26 + 10)
    ctx.font = '14px Arial'
    OPTIONS.forEach(function(o, i) {
      const count = counts[o.key] || 0
      const pct = Math.round((count / total) * 100)
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fillRect(lx, ly - 11, 14, 14)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 0.5
      ctx.strokeRect(lx, ly - 11, 14, 14)
      ctx.fillStyle = '#000'
      ctx.textAlign = 'left'
      ctx.fillText(o.label + ' - ' + pct + '%', lx + 20, ly + 1)
      ly += 26
    })
  }

  // Cache last-known counts so we can optimistically update
  var lastCounts = null

  async function fetchAndDraw() {
    try {
      const res = await fetch('/api/poll')
      const counts = await res.json()
      lastCounts = counts
      document.getElementById('poll-chart-wrap').style.display = 'block'
      drawPie(counts)
    } catch (_) {}
  }

  function showChartOptimistic(option) {
    var counts = lastCounts || {}
    // Copy so we don't mutate the cached object
    var updated = {}
    OPTIONS.forEach(function(o) { updated[o.key] = counts[o.key] || 0 })
    updated[option] = (updated[option] || 0) + 1
    lastCounts = updated
    document.getElementById('poll-chart-wrap').style.display = 'block'
    drawPie(updated)
  }

  function init() {
    // Always show results if any votes exist
    fetchAndDraw()

    const voted = localStorage.getItem(STORAGE_KEY)

    if (voted) {
      document.querySelectorAll('.poll-btn').forEach(function(btn) {
        btn.disabled = true
        btn.style.opacity = '0.5'
        btn.style.cursor = 'default'
        if (btn.dataset.option === voted) {
          btn.style.opacity = '1'
          btn.style.boxShadow = '0 0 0 3px #333'
        }
      })
      document.getElementById('poll-thanks').style.display = 'block'
      return
    }

    document.querySelectorAll('.poll-btn').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        const option = btn.dataset.option
        localStorage.setItem(STORAGE_KEY, option)

        document.querySelectorAll('.poll-btn').forEach(function(b) {
          b.disabled = true
          b.style.opacity = '0.5'
          b.style.cursor = 'default'
        })
        btn.style.opacity = '1'
        btn.style.boxShadow = '0 0 0 3px #333'
        document.getElementById('poll-thanks').style.display = 'block'

        // Immediately show the chart with the new vote
        showChartOptimistic(option)
        document.getElementById('poll-chart-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        try {
          await fetch('/api/poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ option: option }),
          })
        } catch (_) {}

        // Refresh with server-confirmed counts
        fetchAndDraw()
      })
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
