// Language Switcher Module
class LanguageSwitcher {
  constructor() {
    this.translations = {};
    this.currentLanguage = localStorage.getItem("language") || "en";
    this.init();
  }

  /**
   * Initialize the language switcher
   */
  async init() {
    await this.loadTranslations();
    this.initializeLanguageSwitcher();
    this.initializeOtherEventListeners();
  }

  /**
   * Load translations from JSON file
   */
  async loadTranslations() {
    const translationFiles = [
      "./translations.json",

      // Add more file paths as needed
    ];

    try {
      const responses = await Promise.all(
        translationFiles.map((file) => fetch(file))
      );
      const jsonResults = await Promise.all(responses.map((res) => res.json()));

      this.translations = jsonResults.reduce((acc, current) => {
        return { ...acc, ...current };
      }, {});
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  }

  /**
   * Get translations for current language
   * @returns {object} Translation object
   */
  getTranslations() {
    return this.translations[this.currentLanguage];
  }

  /**
   * Apply translations to DOM elements
   */
  applyTranslations() {
    const langData = this.getTranslations();

    // Update document title
    if (langData.title) {
      document.title = langData.title;
    }

    if (langData.videoUrl) {
      const videoPlayer = document.getElementById("youtube-player");
      if (videoPlayer) {
        videoPlayer.src = langData.youtubeUrl;
      }
    }

    // Update elements with data-key
    document.querySelectorAll("[data-key]").forEach((element) => {
      const key = element.getAttribute("data-key");
      if (langData[key]) {
        element.textContent = langData[key];
      }
    });

    // Update elements with data-lang-html (for content that includes HTML tags)
    document.querySelectorAll("[data-lang-html]").forEach((element) => {
      const key = element.getAttribute("data-lang-html");
      if (langData[key]) {
        element.innerHTML = langData[key];
      }
    });

    // Update elements with data-lang-title (for title attributes)
    document.querySelectorAll("[data-lang-title]").forEach((element) => {
      const key = element.getAttribute("data-lang-title");
      if (langData[key]) {
        element.title = langData[key];
      }
    });
  }

  /**
   * Set language and apply translations
   * @param {string} langCode - Language code ('en' or 'id')
   */
  setLanguage(langCode) {
    if (this.translations[langCode]) {
      this.currentLanguage = langCode;
      localStorage.setItem("language", langCode);
      this.applyTranslations();
      this.updateVideoSource();
    } else {
      console.warn(`Language code '${langCode}' not found.`);
    }
  }

  updateVideoSource() {
    const videoPlayer = document.getElementById("youtube-player");
    if (!videoPlayer) return;

    const videoSources = {
      en: "https://www.youtube.com/embed/asqG542EEj4?autoplay=1&cc_load_policy=1", // Your English video
      id: "https://www.youtube.com/embed/aaxF9bSGlv8?autoplay=1&cc_load_policy=1", // Replace with Indonesian video ID
    };

    if (videoSources[this.currentLanguage]) {
      videoPlayer.src = videoSources[this.currentLanguage];
    }
  }

  /**
   * Initialize language switcher button
   */
  initializeLanguageSwitcher() {
    const languageSwitcher = document.getElementById("languageSwitcher");
    const languageText = document.getElementById("languageText");

    if (!languageSwitcher || !languageText) {
      console.warn("Language switcher elements not found");
      return;
    }

    // Set initial display based on current language
    this.updateSwitcherDisplay(languageSwitcher, languageText);

    languageSwitcher.addEventListener("click", () => {
      const newLang = this.currentLanguage === "en" ? "id" : "en";
      this.setLanguage(newLang);
      this.updateSwitcherDisplay(languageSwitcher, languageText);
    });

    this.applyTranslations(); // Apply translations on initial load
    this.updateVideoSource();
  }

  /**
   * Update switcher button display
   * @param {HTMLElement} switcher - The switcher button element
   * @param {HTMLElement} textElement - The text element inside the button
   */
  updateSwitcherDisplay(switcher, textElement) {
    textElement.textContent = this.currentLanguage.toUpperCase();

    if (this.currentLanguage === "en") {
      switcher.classList.remove("bg-black", "text-white");
      switcher.classList.add("bg-white", "text-black");
    } else {
      switcher.classList.remove("bg-white", "text-black");
      switcher.classList.add("bg-black", "text-white");
    }
  }

  /**
   * Initialize other event listeners (myth cards, mobile menu)
   */
  initializeOtherEventListeners() {
    // Myth card toggle functionality
    document.querySelectorAll(".myth-card").forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("active");
      });
    });

    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }
  }
}

// Initialize when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  new LanguageSwitcher();
});
