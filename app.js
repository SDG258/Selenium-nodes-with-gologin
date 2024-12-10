const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const browserPath =
  "C:\\ProgramFiles\\GoLogin_Pro\\orbita-browser-114\\chrome.exe";
const profilePaths = [
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\0F37063EFF5F65E67496E98D69C94965",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\1D83C3662B4431E469D5C246699367B7",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\06FF6439A95F0B455FEAB3F6820F064C",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\24F59BD03211B1DB5A42ED6CB7F8B3C6",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\A7555E5A3740CB9EDC067CA41B15D610",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\DBB434BA300CBD15FACEBA7EBCF8E3BE",
  // "C:\\ProgramFiles\\GoLogin_Pro\\Profile_ALL\\BCFF72CD4B03577E1D5E186A083A10CF",
];
const urls = [
  // {
  //   url: "https://web.telegram.org/k/#@bums",
  //   startButton: ".new-message-bot-commands.is-view",
  // },
  // {
  //   url: "https://web.telegram.org/k/#@sidekick_fans_bot",
  //   startButton: ".new-message-bot-commands.is-view",
  // },
  // {
  //   url: "https://web.telegram.org/k/#@OKX_official_bot",
  //   startButton: ".new-message-bot-commands.is-view",
  // },
  // {
  //     url: 'https://web.telegram.org/k/#@DuckChain_bot',
  //     startButton: '.new-message-bot-commands.is-view'
  // },
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
  {
    url: "https://web.telegram.org/k/#@seed_coin_bot",
    startButton: ".new-message-bot-commands.is-view",
  },
  // {
  //     url: 'https://web.telegram.org/k/#@MatchQuestBot',
  //     startButton: '.anchor-url.is-link.reply-markup-button.rp'
  // },
];

function getFileNameFromUrl(url) {
  const urlParts = new URL(url);
  const name = urlParts.hash ? urlParts.hash.split("@")[1] : urlParts.hostname;
  return name ? name.replace(/[^a-zA-Z0-9]/g, "_") + "_data.txt" : "data.txt";
}

async function waitForElement(driver, selector) {
  try {
    const element = await driver.wait(
      until.elementLocated(By.css(selector)),
      20000
    );
    await driver.wait(until.elementIsVisible(element), 20000);
    return element;
  } catch (error) {
    console.error(`Không thể tìm thấy phần tử: ${selector}`, error);
    throw error;
  }
}

async function elementExists(driver, selector) {
  try {
    await driver.wait(until.elementLocated(By.css(selector)), 10000);
    return true;
  } catch {
    return false;
  }
}

(async function openBrowserWithProfiles() {
  for (const profilePath of profilePaths) {
    let options = new chrome.Options();
    options.setChromeBinaryPath(browserPath);
    options.addArguments(`user-data-dir=${profilePath}`);
    options.addArguments(`user-data-dir=${profilePath}`);
    options.addArguments("--auto-open-devtools-for-tabs");
    // options.addArguments("--headless=new");
    options.addArguments("--window-size=1280,1024");
    options.addArguments("--disable-gpu");
    options.addArguments("--log-level=3");
    options.addArguments(
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    let driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    try {
      for (const { url, startButton } of urls) {
        console.log(`Đang mở trang: ${url}`);
        await driver.sleep(2000);
        await driver.navigate().refresh();
        await driver.get(url);

        try {
          console.log(`Đang kiểm tra sự tồn tại của nút: ${startButton}`);
          const buttonExists = await elementExists(driver, startButton);
          await driver.sleep(2000);

          if (buttonExists) {
            const commandButton = await waitForElement(driver, startButton);
            console.log(`Đang nhấp vào nút: ${startButton}`);

            // Cuộn đến nút trước khi nhấp:
            await driver.executeScript(
              "arguments[0].scrollIntoViewIfNeeded();",
              commandButton
            );

            // Chờ hiển thị:
            await driver.sleep(1000);

            // Sử dụng JavaScript để click vào nút:
            await driver.executeScript("arguments[0].click();", commandButton);

            await driver.sleep(2000);
            await driver.executeScript(
              'if (typeof allow_pasting === "function") { allow_pasting(); }'
            );

            // Kiểm tra sự tồn tại của popup-button
            const popupButtonExists = await elementExists(
              driver,
              "button.popup-button.btn.primary.rp"
            );
            if (popupButtonExists) {
              console.log(
                `Đang nhấn vào nút popup: button.popup-button.btn.primary.rp`
              );
              await driver.sleep(3000);
              const popupButton = await waitForElement(
                driver,
                "button.popup-button.btn.primary.rp"
              );
              await popupButton.click();
              await driver.sleep(3000);
              console.log(`Đã nhấn vào nút popup.`);
            } else {
              console.log(`Phần tử popup không tồn tại, tiếp tục...`);
            }

            const iframes = await driver.findElements(By.css("iframe"));
            if (iframes.length > 0) {
              const tgWebAppData = await driver.executeScript(`
                                const iframeSrc = document.querySelector('iframe').src.split('#')[1];
                                return new URLSearchParams(iframeSrc).get('tgWebAppData');
                            `);
              console.log("tgWebAppData:", tgWebAppData);
              const fileName = getFileNameFromUrl(url);

              // Append data to file
              fs.appendFileSync(fileName, tgWebAppData + "\n", "utf8");
              console.log(`Đã lưu tgWebAppData vào ${fileName}`);
            } else {
              console.log("Không có iframe nào trên trang.");
            }

            // Nhấn vào nút header sau khi lấy xong dữ liệu
            console.log(
              `Đang nhấn vào nút header: .btn-icon._BrowserHeaderButton_m63td_65`
            );
            await waitForElement(
              driver,
              ".btn-icon._BrowserHeaderButton_m63td_65"
            );
            const headerButton = await driver.findElement(
              By.css(".btn-icon._BrowserHeaderButton_m63td_65")
            );

            // Cuộn đến nút header trước khi nhấp:
            await driver.executeScript(
              "arguments[0].scrollIntoViewIfNeeded();",
              headerButton
            );

            // Chờ hiển thị nút header:
            await driver.sleep(1000);

            // Sử dụng JavaScript để click vào nút header:
            await driver.executeScript("arguments[0].click();", headerButton);

            console.log(`Đã nhấn vào nút header.`);
          } else {
            console.log(`Phần tử không tồn tại: ${startButton}`);
          }
        } catch (innerError) {
          console.error("Đã xảy ra lỗi khi xử lý trang:", innerError);
          // Xử lý lỗi, ví dụ: chụp ảnh màn hình
        }
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      // Xử lý lỗi, ví dụ: chụp ảnh màn hình
    } finally {
      // await driver.quit();
    }
  }
})();
