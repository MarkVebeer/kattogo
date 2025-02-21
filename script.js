let cookieCount = 0;
let clickPower = 1;
let clickUpgradeCost = 10;
let clickUpgradeLevel = 1;
let hasPurchasedFirstUpgrade = false;
let dvdSpeed = 5;
let pedoUpgradeCost = 1000000;
let pedoUpgradeCount = 0;
let dvdLogoCount = 0;
const MAX_DVD_LOGOS = 100;
let autoClicksPerSecond = 0;
const CLICKS_PER_DVD = 100000;

const cookieButton = document.getElementById("cookieButton");
const cookieCountDisplay = document.getElementById("cookieCount");
const clickPowerDisplay = document.getElementById("clickPower");
const clickSound = document.getElementById("clickSound");
const kattogas = document.getElementById("kattogas");

const buttonImg = document.querySelector("#cookieButton img");
const upgradeClickButton = document.getElementById("upgradeClick");
const upgradeClickCostDisplay = document.getElementById("upgradeClickCost");
const pedoUpgradeButton = document.getElementById("pedoUpgrade");
const pedoUpgradeCostDisplay = document.getElementById("pedoUpgradeCost");

function createDvdLogo() {
    if (dvdLogoCount >= MAX_DVD_LOGOS) return;

    const img = document.createElement('img');
    img.src = 'img/2.gif';
    img.className = 'dvd-logo';
    img.style.position = 'fixed';
    img.style.width = '100px';
    img.style.zIndex = '1';
    
    let x = Math.random() * (window.innerWidth - 100);
    let y = Math.random() * (window.innerHeight - 100);
    let dx = dvdSpeed;
    let dy = dvdSpeed;
    
    document.body.appendChild(img);
    dvdLogoCount++;
    
    function moveLogo() {
        x += dx;
        y += dy;
        
        if (x <= 0 || x >= window.innerWidth - 100) dx = -dx;
        if (y <= 0 || y >= window.innerHeight - 100) dy = -dy;
        
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        
        requestAnimationFrame(moveLogo);
    }
    
    moveLogo();
}

function createSimpleImage() {
    const img = document.createElement('img');
    img.src = 'img/1.png';
    img.className = 'floating-image';
    
    const randomX = Math.random() * (window.innerWidth - 50);
    const randomY = Math.random() * (window.innerHeight - 50);
    
    img.style.left = randomX + 'px';
    img.style.top = randomY + 'px';
    img.style.width = '50px';
    
    document.body.appendChild(img);
    
    setTimeout(() => {
        img.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(img);
        }, 1000);
    }, 1000);
}

function buyClickUpgrade() {
    if (cookieCount >= clickUpgradeCost) {
        cookieCount -= clickUpgradeCost;
        clickUpgradeLevel++;
        clickPower = Math.pow(2, clickUpgradeLevel - 1);
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        hasPurchasedFirstUpgrade = true;
        
        cookieCountDisplay.textContent = cookieCount;
        clickPowerDisplay.textContent = clickPower;
        upgradeClickCostDisplay.textContent = clickUpgradeCost;
        updateButtons();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createSimpleImage(), i * 200);
        }
        
        kattogas.pause();
        kattogas.currentTime = 0;
        kattogas.play();
    }
}

function buyPedoUpgrade() {
    if (cookieCount >= pedoUpgradeCost && dvdLogoCount < MAX_DVD_LOGOS) {
        cookieCount -= pedoUpgradeCost;
        cookieCountDisplay.textContent = cookieCount;
        dvdSpeed *= 1.1;
        pedoUpgradeCount++;
        
        autoClicksPerSecond += CLICKS_PER_DVD;
        
        pedoUpgradeCost = Math.floor(Math.pow(1.5, pedoUpgradeCount) * 1000000);
        pedoUpgradeCostDisplay.textContent = pedoUpgradeCost.toLocaleString();
        
        if (pedoUpgradeCount === 1) {
            createDvdLogo();
            startAutoClicker();
        }
        
        if (pedoUpgradeCount % 10 === 0 && dvdLogoCount * 2 <= MAX_DVD_LOGOS) {
            const logosToCreate = Math.min(dvdLogoCount, MAX_DVD_LOGOS - dvdLogoCount);
            for (let i = 0; i < logosToCreate; i++) {
                createDvdLogo();
            }
        }
        
        updateButtons();
    }
}

function startAutoClicker() {
    setInterval(() => {
        if (autoClicksPerSecond > 0) {
            cookieCount += autoClicksPerSecond;
            cookieCountDisplay.textContent = cookieCount;
            updateButtons();
        }
    }, 1000);
}

function updateButtons() {
    upgradeClickButton.disabled = cookieCount < clickUpgradeCost;
    if (pedoUpgradeButton) {
        pedoUpgradeButton.disabled = cookieCount < pedoUpgradeCost || dvdLogoCount >= MAX_DVD_LOGOS;
        document.getElementById('dvdCount').textContent = `${dvdLogoCount}/${MAX_DVD_LOGOS}`;
    }
}

cookieButton.addEventListener("click", function() {
    cookieCount += clickPower;
    cookieCountDisplay.textContent = cookieCount;
    
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();
    
    buttonImg.classList.add('button-clicked');
    if (hasPurchasedFirstUpgrade) {
        createSimpleImage();
    }
    
    updateButtons();
    
    setTimeout(() => {
        buttonImg.classList.remove('button-clicked');
    }, 300);
});

upgradeClickButton.addEventListener("click", buyClickUpgrade);
if (pedoUpgradeButton) {
    pedoUpgradeButton.addEventListener("click", buyPedoUpgrade);
}

updateButtons();