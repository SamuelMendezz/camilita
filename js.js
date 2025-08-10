let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const getXY = (e, index = 0) => {
      if (e.type.startsWith("touch") || e.touches) {
        return {
          x: e.touches[index].clientX,
          y: e.touches[index].clientY
        };
      }
      return {
        x: e.clientX,
        y: e.clientY
      };
    };

    const moveHandler = (e) => {
      e.preventDefault();

      // Rotación con dos dedos en móvil
      if (e.type.startsWith("touch") && e.touches.length === 2) {
        const p1 = getXY(e, 0);
        const p2 = getXY(e, 1);
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        this.rotation = angle * (360 / Math.PI);
      } else {
        const { x, y } = getXY(e);
        if (!this.rotating) {
          this.mouseX = x;
          this.mouseY = y;
          this.velX = this.mouseX - this.prevMouseX;
          this.velY = this.mouseY - this.prevMouseY;
        }

        if (this.holdingPaper && !this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      if (this.holdingPaper) {
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      if (e.type.startsWith("touch")) {
        if (e.touches.length === 1) {
          const { x, y } = getXY(e);
          this.mouseTouchX = x;
          this.mouseTouchY = y;
          this.prevMouseX = x;
          this.prevMouseY = y;
          this.rotating = false;
        } else if (e.touches.length === 2) {
          this.rotating = true;
        }
      } else {
        if (e.button === 0) {
          const { x, y } = getXY(e);
          this.mouseTouchX = x;
          this.mouseTouchY = y;
          this.prevMouseX = x;
          this.prevMouseY = y;
          this.rotating = false;
        }
        if (e.button === 2) {
          this.rotating = true;
        }
      }
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // PC
    document.addEventListener('mousemove', moveHandler);
    paper.addEventListener('mousedown', startHandler);
    window.addEventListener('mouseup', endHandler);

    // Móvil
    document.addEventListener('touchmove', moveHandler, { passive: false });
    paper.addEventListener('touchstart', startHandler, { passive: false });
    window.addEventListener('touchend', endHandler);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

