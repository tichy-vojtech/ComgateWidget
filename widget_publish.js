(function(window) {
    const ComgateWidget = (() => {
        function openCenteredPopup(url, title, w = 1200, h = 850) {
            const screenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            const screenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;

            const left = screenLeft + (screenWidth - w) / 2;
            const top = screenTop + (screenHeight - h) / 2;

            const features = `scrollbars=yes,resizable=yes,width=${w},height=${h},top=${top},left=${left}`;
            const newWindow = window.open(url, title, features);

            if (newWindow && newWindow.focus) {
                newWindow.focus();
            }
        }

        const openCalc = (type, amountRaw) => {
            const czkAmount = parseInt(amountRaw, 10);
            if (isNaN(czkAmount) || czkAmount < 100) {
                return alert("Zadej platnou částku v Kč (např. 5000)");
            }

            if (type === "cofidis") {
                const url = `https://cofidispay.cofidis.cz/webeshop-calculator/webeshop-calculator-embed.html?amount=${czkAmount}&partnerId=25375`;
                openCenteredPopup(url, "Cofidis Pay");
            } else if (type === "homecredit") {
                const price = czkAmount * 100;
                const url = `https://kalkulacka.homecredit.cz?productSetCode=COCHCONL&downPayment=0&apiKey=buhGztsSbU2Evsx57tYn&fixDownPayment=false&price=${price}`;
                openCenteredPopup(url, "HomeCredit Kalkulačka");
            } else {
                alert("Neznámý typ kalkulačky.");
            }
        };

        const createModal = (price) => {
            const overlay = document.createElement("div");
            overlay.id = "comgate-widget-overlay";

            const modal = document.createElement("div");
            modal.id = "comgate-widget-modal";

            const header = document.createElement("div");
            header.className = "modal-header";

            const title = document.createElement("h2");
            title.textContent = `Vyber kalkulačku pro částku ${price} Kč`;

            const closeBtn = document.createElement("button");
            closeBtn.innerHTML = "&times;";
            closeBtn.className = "modal-close";
            closeBtn.onclick = () => overlay.remove();

            header.appendChild(title);
            header.appendChild(closeBtn);
            modal.appendChild(header);

            const btnCofidis = document.createElement("button");
            btnCofidis.textContent = "Cofidis";
            btnCofidis.className = "calc-btn";
            btnCofidis.onclick = () => openCalc("cofidis", price);

            const btnHomecredit = document.createElement("button");
            btnHomecredit.textContent = "HomeCredit";
            btnHomecredit.className = "calc-btn";
            btnHomecredit.onclick = () => openCalc("homecredit", price);

            modal.appendChild(btnCofidis);
            modal.appendChild(btnHomecredit);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        };

        const injectStyles = () => {
            if (document.getElementById("comgate-widget-styles")) return;

            const style = document.createElement("style");
            style.id = "comgate-widget-styles";
            style.textContent = `
        #comgate-widget-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #comgate-widget-modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }

        #comgate-widget-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        #comgate-widget-modal .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          flex: 1;
        }

        .modal-close {
          font-size: 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: #333;
          transition: color 0.3s;
          user-select: none;
          padding: 0 0.3rem;
        }

        .modal-close:hover {
          color: red;
        }

        .calc-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1.1rem;
        }

        @media (max-width: 480px) {
          #comgate-widget-modal {
            max-width: 95%;
            padding: 1.5rem 1rem;
          }

          #comgate-widget-modal .modal-header h2 {
            font-size: 1.25rem;
          }

          .calc-btn {
            font-size: 1rem;
            padding: 0.7rem 1rem;
          }
        }
      `;
            document.head.appendChild(style);
        };

        const run = ({ elementId, amount }) => {
            injectStyles();
            const el = document.getElementById(elementId);
            if (!el) {
                console.error(`ComgateWidget: Element with id '${elementId}' not found`);
                return;
            }
            el.addEventListener("click", () => createModal(amount));
        };

        return { run };
    })();

    window.ComgateWidget = ComgateWidget;
})(window);
