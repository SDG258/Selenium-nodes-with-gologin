const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const browserPath = 'C:\\ProgramFiles\\GoLogin_Pro\\orbita-browser-114\\chrome.exe';
const profilePaths = [
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\0F37063EFF5F65E67496E98D69C94965',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\1D83C3662B4431E469D5C246699367B7',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\06FF6439A95F0B455FEAB3F6820F064C',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\24F59BD03211B1DB5A42ED6CB7F8B3C6',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\A7555E5A3740CB9EDC067CA41B15D610',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\DBB434BA300CBD15FACEBA7EBCF8E3BE',
    'C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\BCFF72CD4B03577E1D5E186A083A10CF',
];
const urls = [
    {
        url: 'https://t.me/OKX_official_bot/OKX_Racer?startapp=linkCode_136802218',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/DuckChain_bot/quack?startapp=Z9GbFeLg',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/sidekick_fans_bot?start=1538608902',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/theYescoin_bot/Yescoin?startapp=oEKCPN',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/birdx2_bot/birdx?startapp=1538608902',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/xkucoinbot/kucoinminiapp?startapp=cm91dGU9JTJGdGFwLWdhbWUlM0ZpbnZpdGVyVXNlcklkJTNEMTUzODYwODkwMiUyNnJjb2RlJTNE',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.anchor-url.is-link.reply-markup-button.rp'
    },
    {
        url: 'https://t.me/PAWSOG_bot/PAWS?startapp=RvVVH3Ey',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/Tomarket_ai_bot/app?startapp=00013Bqp',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/blum/app?startapp=ref_qnOhKsZxuV',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/seed_coin_bot/app?startapp=1538608902',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.new-message-bot-commands.is-view'
    },
    {
        url: 'https://t.me/MatchQuestBot/start?startapp=e168d033bf9342808f301448e055ef87',
        start: "//div[contains(@class, 'chat-input-control')]//button[contains(@class, 'chat-input-control-button') and .//span[text()='START']]",
        startButton: '.anchor-url.is-link.reply-markup-button.rp'
    },
];

// Hàm lấy tên file từ URL
function getFileNameFromUrl(url) {
    const urlParts = new URL(url);
    const name = urlParts.hash ? urlParts.hash.split('@')[1] : urlParts.hostname;
    return name ? name.replace(/[^a-zA-Z0-9]/g, '_') + '_data.txt' : 'data.txt';
}

// Hàm chờ phần tử
async function waitForElement(driver, selector, isXPath = false) {
    try {
        const element = isXPath
            ? await driver.wait(until.elementLocated(By.xpath(selector)), 20000)
            : await driver.wait(until.elementLocated(By.css(selector)), 20000);
        await driver.wait(until.elementIsVisible(element), 20000);
        return element;
    } catch (error) {
        console.error(`Không thể tìm thấy phần tử: ${selector}`, error);
        throw error;
    }
}

// Hàm kiểm tra sự tồn tại của phần tử
async function elementExists(driver, selector, isXPath = false) {
    try {
        isXPath
            ? await driver.wait(until.elementLocated(By.xpath(selector)), 10000)
            : await driver.wait(until.elementLocated(By.css(selector)), 10000);
        return true;
    } catch {
        return false;
    }
}

// Chạy trình duyệt với các profile
(async function openBrowserWithProfiles() {
    for (const profilePath of profilePaths) {
        let options = new chrome.Options();
        options.setChromeBinaryPath(browserPath);
        options.addArguments(`user-data-dir=${profilePath}`);
        options.addArguments('--headless=new');
        options.addArguments('--window-size=1280,1024');
        options.addArguments('--disable-gpu');
        options.addArguments('--log-level=3');

        let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        try {
            for (const { url, start, startButton } of urls) {
                console.log(`Đang mở trang: ${url}`);
                await driver.get(url);
                await driver.sleep(3000); // Chờ trang tải

                // Tìm và nhấn nút START
                console.log(`Đang kiểm tra nút START: ${start}`);
                const startExists = await elementExists(driver, start, true);

                if (startExists) {
                    const startElement = await waitForElement(driver, start, true);
                    console.log("Đã tìm thấy nút START. Đang nhấn...");
                    await driver.executeScript("arguments[0].scrollIntoViewIfNeeded();", startElement);
                    await driver.sleep(1000);
                    await driver.executeScript("arguments[0].click();", startElement);
                    console.log("Đã nhấn vào nút START.");
                } else {
                    console.log(`Không tìm thấy nút START: ${start}`);
                }

                // Tìm và nhấn nút startButton
                console.log(`Đang kiểm tra nút: ${startButton}`);
                const buttonExists = await elementExists(driver, startButton);
                if (buttonExists) {
                    const commandButton = await waitForElement(driver, startButton);
                    console.log(`Đã tìm thấy nút: ${startButton}. Đang nhấn...`);
                    await driver.executeScript("arguments[0].scrollIntoViewIfNeeded();", commandButton);
                    await driver.sleep(1000);
                    await driver.executeScript("arguments[0].click();", commandButton);
                    console.log(`Đã nhấn vào nút: ${startButton}`);
                } else {
                    console.log(`Không tìm thấy nút: ${startButton}`);
                }

                // Lấy dữ liệu từ iframe nếu tồn tại
                const iframes = await driver.findElements(By.css('iframe'));
                if (iframes.length > 0) {
                    const tgWebAppData = await driver.executeScript(`
                        const iframeSrc = document.querySelector('iframe').src.split('#')[1];
                        return new URLSearchParams(iframeSrc).get('tgWebAppData');
                    `);
                    console.log("tgWebAppData:", tgWebAppData);
                    const fileName = getFileNameFromUrl(url);

                    // Lưu dữ liệu vào file
                    fs.appendFileSync(fileName, tgWebAppData + '\n', 'utf8');
                    console.log(`Đã lưu tgWebAppData vào ${fileName}`);
                } else {
                    console.log("Không có iframe nào trên trang.");
                }
            }
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
        } finally {
            await driver.quit();
        }
    }
})();
