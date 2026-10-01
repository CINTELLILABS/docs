/*
  Repaint the welcome page's colour field on load.

  The page ships one good field in its markup, generated at authoring time, so
  it is correct with no JavaScript at all. This makes it a different field each
  visit, using the same two rules the generator uses:

  1. WEIGHTED, not uniform. Orange and Yellow are 45% of the field between them
     and the four darks 13%, which is the hand-built mix, counted.
  2. NO TOUCHING TWINS. A colour is rejected if the cell to its left or above
     already holds it, because two same-coloured neighbours weld into one
     double-width block and that is what destroys the deck grid.

  This lives here rather than in the page because Mintlify's production build
  rejects `export const` in an .mdx, and a <script> tag written into the page
  is inserted by React without ever executing. Mintlify loads this file on
  every page, so it checks for the field and returns immediately elsewhere.
*/
(function () {
  var PALETTE = [['#FF5900', 20], ['#F9A900', 20], ['#048244', 9], ['#C238DA', 8],
    ['#1C54A5', 8], ['#CA071A', 5], ['#001847', 4], ['#5E007E', 4],
    ['#DB005F', 3], ['#151515', 3], ['#FF4294', 3], ['#004121', 1]];
  var TOTAL = PALETTE.reduce(function (n, p) { return n + p[1]; }, 0);

  function pick(banned) {
    for (var tries = 0; tries < 24; tries++) {
      var t = Math.random() * TOTAL;
      var chosen = PALETTE[PALETTE.length - 1][0];
      for (var i = 0; i < PALETTE.length; i++) {
        t -= PALETTE[i][1];
        if (t <= 0) { chosen = PALETTE[i][0]; break; }
      }
      if (banned.indexOf(chosen) === -1) return chosen;
    }
    return PALETTE[0][0];
  }

  function repaint() {
    var field = document.querySelector('.splash-frame-a');
    if (!field) return false;
    var cells = field.querySelectorAll('.splash-cell');
    if (!cells.length) return false;

    // Grid position is read back off each cell's own inline style, so the
    // authored markup stays the only place that says WHERE a cell sits.
    var list = [];
    for (var i = 0; i < cells.length; i++) {
      var st = cells[i].style;
      list.push({
        el: cells[i],
        col: parseInt(st.gridColumnStart || st.gridColumn, 10),
        row: parseInt(st.gridRowStart || st.gridRow, 10)
      });
    }

    // Reading order first: the rejection can only see neighbours already
    // painted, and the authored list runs the L down before the band across.
    list.sort(function (a, b) { return (a.row - b.row) || (a.col - b.col); });

    var placed = {};
    for (var j = 0; j < list.length; j++) {
      var c = list[j];
      var banned = [placed[(c.col - 1) + ':' + c.row], placed[c.col + ':' + (c.row - 1)]]
        .filter(Boolean);
      var colour = pick(banned);
      placed[c.col + ':' + c.row] = colour;
      c.el.style.backgroundColor = colour;
      // The breathing cells carry a second colour on a child span.
      var breath = c.el.firstElementChild;
      if (breath) breath.style.backgroundColor = pick([colour]);
    }
    return true;
  }

  // The page is client-routed, so the field can arrive after this file does.
  // Try immediately, then watch briefly, then stop.
  if (!repaint()) {
    var tries = 0;
    var timer = setInterval(function () {
      if (repaint() || ++tries > 40) clearInterval(timer);
    }, 50);
  }
})();
