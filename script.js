document.addEventListener("DOMContentLoaded", () => {
  // Stage 1: Entrance Gift Box Event
  const giftStage = document.getElementById("gift-stage");
  if (giftStage) {
    giftStage.addEventListener("click", openGift);
  }

  // Initialize custom cursor trail effect
  initHeartCursor();
});

/* Stage Transition */
function openGift() {
  const giftStage = document.getElementById("gift-stage");
  const mainSite = document.getElementById("main-site");

  if (giftStage && mainSite) {
    giftStage.style.display = "none";
    mainSite.style.display = "flex";
    initInteractiveTree();
  }
}

/* Page Navigation */
function switchPage(pageId, btn) {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((button) => button.classList.remove("active"));

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }
  if (btn) {
    btn.classList.add("active");
  }
}

/* Memory Card Like Counter */
function likeCard(button) {
  let countSpan = button.querySelector(".count");
  if (countSpan) {
    countSpan.textContent = parseInt(countSpan.textContent, 10) + 1;
  }
}

/* Interactive Floating Cursor Trail */
function initHeartCursor() {
  const hearts = ["❤️", "💖", "✨", "🌸"];

  document.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.15) {
      const heart = document.createElement("span");
      heart.className = "heart-trail";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

      heart.style.left = e.pageX + "px";
      heart.style.top = e.pageY + "px";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  });
}

/* Canvas Interactive Heart Blossom Tree */
function initInteractiveTree() {
  const canvas = document.getElementById("heartTreeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  let branches = [];
  let blossoms = [];
  let floatingParticles = [];

  // Helper: Draw parametric heart shape
  function drawHeart(x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = color;

    for (let a = 0; a < Math.PI * 2; a += 0.1) {
      let r = size;
      let hx = 16 * Math.pow(Math.sin(a), 3);
      let hy = -(
        13 * Math.cos(a) -
        5 * Math.cos(2 * a) -
        2 * Math.cos(3 * a) -
        Math.cos(4 * a)
      );
      if (a === 0) {
        ctx.moveTo((hx * r) / 15, (hy * r) / 15);
      } else {
        ctx.lineTo((hx * r) / 15, (hy * r) / 15);
      }
    }
    ctx.fill();
    ctx.restore();
  }

  // Static Tree Skeleton Generator
  function generateTreeStructure(x, y, len, angle, branchWidth) {
    let endX = x + Math.sin((angle * Math.PI) / 180) * len;
    let endY = y - Math.cos((angle * Math.PI) / 180) * len;

    branches.push({ x1: x, y1: y, x2: endX, y2: endY, width: branchWidth });

    if (len < 12) {
      for (let i = 0; i < 3; i++) {
        blossoms.push({
          x: endX + (Math.random() * 50 - 25),
          y: endY + (Math.random() * 40 - 20),
          size: Math.random() * 5 + 3,
          color: ["#ff4d6d", "#ff758f", "#ffb3c1", "#c77dff"][
            Math.floor(Math.random() * 4)
          ],
          pulse: Math.random() * Math.PI,
        });
      }
      return;
    }

    generateTreeStructure(
      endX,
      endY,
      len * 0.75,
      angle + 25,
      branchWidth * 0.7,
    );
    generateTreeStructure(
      endX,
      endY,
      len * 0.75,
      angle - 25,
      branchWidth * 0.7,
    );
  }

  generateTreeStructure(width / 2, height - 15, 55, 0, 7);

  // Interactive Click Event (Rising particles)
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = 0; i < 15; i++) {
      floatingParticles.push({
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 6 + 3,
        color: "#ff4d6d",
        alpha: 1,
      });
    }
  });

  // Render Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Render Trunk and Branches
    ctx.strokeStyle = "#5a3a28";
    ctx.lineCap = "round";
    branches.forEach((b) => {
      ctx.beginPath();
      ctx.lineWidth = b.width;
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
    });

    // 2. Render Pulsing Heart Canopy
    blossoms.forEach((b) => {
      b.pulse += 0.03;
      let currentSize = b.size + Math.sin(b.pulse) * 0.8;
      drawHeart(b.x, b.y, currentSize, b.color, 0.9);
    });

    // 3. Render Interactive Particles
    for (let i = floatingParticles.length - 1; i >= 0; i--) {
      let p = floatingParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.015;

      if (p.alpha <= 0) {
        floatingParticles.splice(i, 1);
      } else {
        drawHeart(p.x, p.y, p.size, p.color, p.alpha);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}
