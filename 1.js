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
    // {
    //     url: 'https://web.telegram.org/a/#7347386273',
    //     startButton: '.Button.bot-menu.open.default.translucent.round',
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@bums',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    {
        url: 'https://web.telegram.org/k/#@OKX_official_bot',
        startButton: '.new-message-bot-commands.is-view'
    },
    // {
    //     url: 'https://web.telegram.org/k/#@DuckChain_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    {
        url: 'https://web.telegram.org/k/#@sidekick_fans_bot',
        startButton: '.new-message-bot-commands.is-view'
    },
    // {
    //     url: 'https://web.telegram.org/k/#@theYescoin_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@birdx2_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@xkucoinbot',
    //     startButton: '.anchor-url.is-link.reply-markup-button.rp'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@PAWSOG_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@Tomarket_ai_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@BlumCryptoBot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@seed_coin_bot',
    //     startButton: '.new-message-bot-commands.is-view'
    // },
    // {
    //     url: 'https://web.telegram.org/k/#@MatchQuestBot',
    //     startButton: '.anchor-url.is-link.reply-markup-button.rp'
    // },
];

function getFileNameFromUrl(url) {
    const urlParts = new URL(url);
    const name = urlParts.hash ? urlParts.hash.split('@')[1] : urlParts.hostname;
    return name ? name.replace(/[^a-zA-Z0-9]/g, '_') + '_data.txt' : 'data.txt';
}

async function waitForElement(driver, selector, timeout = 20000) {
    try {
        const element = await driver.wait(until.elementLocated(By.css(selector)), timeout);
        await driver.wait(until.elementIsVisible(element), timeout);
        return element;
    } catch (error) {
        console.error(`Không thể tìm thấy phần tử: ${selector}`, error);
        throw error;
    }
}

async function elementExists(driver, selector, timeout = 10000) {
    try {
        await driver.wait(until.elementLocated(By.css(selector)), timeout);
        return true;
    } catch {
        return false;
    }
}

async function clickButton(driver, selector) {
    try {
        console.log(`Đang tìm nút: ${selector}`);
        const button = await waitForElement(driver, selector);

        // Cuộn nút vào khung nhìn
        await driver.executeScript("arguments[0].scrollIntoViewIfNeeded();", button);

        // Đợi 1 giây để đảm bảo nút được tải
        await driver.sleep(1000);

        // Click nút bằng JavaScript
        await driver.executeScript("arguments[0].click();", button);

        console.log(`Đã click vào nút: ${selector}`);
    } catch (error) {
        console.error(`Lỗi khi click vào nút: ${selector}`, error);
        throw error;
    }
}

async function getPageData(driver) {
    try {
        // Cách 1: Lấy dữ liệu từ URL của trang
        const currentUrl = await driver.getCurrentUrl();
        const urlParams = new URLSearchParams(currentUrl.split('#')[1]);
        const tgWebAppData = urlParams.get('tgWebAppData');

        if (tgWebAppData) {
            console.log("tgWebAppData từ URL:", tgWebAppData);
            return tgWebAppData;
        }

        // // Cách 2: Tìm kiếm dữ liệu từ các phần tử khác nếu có
        // const dataElement = await driver.findElements(By.css('.bot-menu-icon.icon.icon-webapp.open')); // Cập nhật selector nếu cần
        // if (dataElement.length > 0) {
        //     const dataText = await dataElement[0].getText();
        //     console.log("Dữ liệu từ phần tử DOM:", dataText);
        //     return dataText;
        // }

        console.log("Không tìm thấy dữ liệu hợp lệ.");
        return null;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trang:", error);
        return null;
    }
}

(async function openBrowserWithProfiles() {
    for (const profilePath of profilePaths) {
        let options = new chrome.Options();
        options.setChromeBinaryPath(browserPath);
        options.addArguments(`user-data-dir=${profilePath}`);
        options.addArguments('--auto-open-devtools-for-tabs');
        options.addArguments('--headless=new');
        options.addArguments('--window-size=1280,1024');
        options.addArguments('--disable-gpu');
        options.addArguments('--log-level=3');
        options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        try {
            for (const { url, startButton } of urls) {
                console.log(`Đang mở trang: ${url}`);
                await driver.get(url);

                try {
                    console.log(`Đang kiểm tra sự tồn tại của nút: ${startButton}`);
                    const buttonExists = await elementExists(driver, startButton);
                    if (buttonExists) {
                        console.log(`Nút tồn tại: ${startButton}`);
                        await clickButton(driver, startButton);

                        // Lấy dữ liệu từ trang
                        const pageData = await getPageData(driver);
                        if (pageData) {
                            const fileName = getFileNameFromUrl(url);
                            fs.appendFileSync(fileName, pageData + '\n', 'utf8');
                            console.log(`Đã lưu dữ liệu vào ${fileName}`);
                        }
                    } else {
                        console.log(`Không tìm thấy nút: ${startButton}`);
                    }
                } catch (innerError) {
                    console.error("Đã xảy ra lỗi khi xử lý trang:", innerError);
                }
            }
        } catch (error) {
            console.error("Đã xảy ra lỗi:", error);
        } finally {
            await driver.quit();
        }
    }
})();