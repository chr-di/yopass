import { expect, test } from '@playwright/test';
import { MockAPI } from './helpers/mock-api';

const en = {
  heading: 'safer than email',
  body: "your message gets encrypted right here in your browser, before it's sent anywhere. the key to unlock it then lives only in the link, not on our server. that's why even we can't read it.",
  bullets: [
    'readable only once',
    'expires automatically',
    'no account, no app needed',
  ],
  footnote: 'we run the server ourselves, with a german provider.',
};

const de = {
  heading: 'sicherer als e-mail',
  body: 'ihre nachricht wird schon in ihrem browser verschlüsselt, bevor sie verschickt wird. der schlüssel zum entschlüsseln steckt danach nur im link, nicht auf unserem server. deshalb können selbst wir die nachricht nicht lesen.',
  bullets: [
    'nur einmal lesbar',
    'läuft automatisch ab',
    'kein konto, keine app nötig',
  ],
  footnote: 'wir betreiben den server selbst, bei einem deutschen anbieter.',
};

test.describe('Studio Vybe branding', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('uses local branding and keeps the trust block independent', async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on('request', request => {
      const url = new URL(request.url());
      if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
        externalRequests.push(request.url());
      }
    });

    const mockAPI = new MockAPI(page);
    await mockAPI.mockConfigEndpoint({
      DISABLE_FEATURES: true,
      THEME_LIGHT: 'studiovybe',
      THEME_DARK: 'studiovybe',
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const trust = page.getByTestId('trust-explainer');
    await expect(trust).toBeVisible();
    await expect(trust.getByRole('heading')).toHaveText(en.heading);
    await expect(trust.getByText(en.body, { exact: true })).toBeVisible();
    for (const bullet of en.bullets) {
      await expect(trust.getByText(bullet, { exact: true })).toBeVisible();
    }
    await expect(trust.getByText(en.footnote, { exact: true })).toBeVisible();
    await expect(
      page.getByText('Share secrets securely with ease', { exact: true }),
    ).toHaveCount(0);

    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      'studiovybe',
    );
    const theme = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        base: style.getPropertyValue('--color-base-100').trim(),
        content: style.getPropertyValue('--color-base-content').trim(),
        primary: style.getPropertyValue('--color-primary').trim(),
        primaryContent: style
          .getPropertyValue('--color-primary-content')
          .trim(),
      };
    });
    expect(theme).toEqual({
      base: 'oklch(100% 0 0)',
      content: 'oklch(31.4% 0.015 321.4)',
      primary: 'oklch(63.6% 0.008 67.7)',
      primaryContent: 'oklch(100% 0 0)',
    });

    await expect(page).toHaveTitle('studio vybe: zugangsdaten sicher senden');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      'href',
      '/yopass.svg',
    );
    const logo = page.locator('header img');
    await expect(logo).toHaveAttribute('alt', 'studio vybe');
    const logoRatios = await logo.evaluate(image => {
      const element = image as HTMLImageElement;
      const rect = element.getBoundingClientRect();
      return {
        natural: element.naturalWidth / element.naturalHeight,
        rendered: rect.width / rect.height,
      };
    });
    const expectedRatio = 205 / 74.0383;
    expect(logoRatios.natural).toBeCloseTo(expectedRatio, 2);
    expect(logoRatios.rendered).toBeCloseTo(expectedRatio, 2);

    await page.waitForFunction(() => document.fonts.check('16px Outfit'));
    const typography = await page.evaluate(() => {
      const probe = document.createElement('code');
      probe.className = 'font-mono';
      document.getElementById('root')!.appendChild(probe);
      const result = {
        rootFamily: getComputedStyle(document.getElementById('root')!)
          .fontFamily,
        monoFamily: getComputedStyle(probe).fontFamily,
        headingTransform: getComputedStyle(document.querySelector('h2')!)
          .textTransform,
        textareaTransform: getComputedStyle(document.querySelector('textarea')!)
          .textTransform,
        placeholderTransform: getComputedStyle(
          document.querySelector('textarea')!,
          '::placeholder',
        ).textTransform,
      };
      probe.remove();
      return result;
    });
    expect(typography.rootFamily).toContain('Outfit');
    expect(typography.monoFamily).toContain('Outfit');
    expect(typography.headingTransform).toBe('lowercase');
    expect(typography.textareaTransform).toBe('none');
    expect(typography.placeholderTransform).toBe('lowercase');

    const mixedCase = 'Fictional-Case-ABC-123';
    const textarea = page.locator('textarea');
    await textarea.fill(mixedCase);
    await expect(textarea).toHaveValue(mixedCase);

    const textareaBottom = await textarea.evaluate(
      element => element.getBoundingClientRect().bottom,
    );
    expect(textareaBottom).toBeLessThanOrEqual(667);
    expect(externalRequests).toEqual([]);

    await mockAPI.clearAllMocks();
  });

  test('renders exact German copy with the complete textarea above fold', async ({
    page,
  }) => {
    const mockAPI = new MockAPI(page);
    await mockAPI.mockConfigEndpoint({
      DISABLE_FEATURES: true,
      THEME_LIGHT: 'studiovybe',
      THEME_DARK: 'studiovybe',
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('settings-menu-button').click();
    await page.locator('#settings-language').selectOption('de');

    const trust = page.getByTestId('trust-explainer');
    await expect(trust.getByRole('heading')).toHaveText(de.heading);
    await expect(trust.getByText(de.body, { exact: true })).toBeVisible();
    for (const bullet of de.bullets) {
      await expect(trust.getByText(bullet, { exact: true })).toBeVisible();
    }
    await expect(trust.getByText(de.footnote, { exact: true })).toBeVisible();

    const metrics = await page.locator('textarea').evaluate(element => ({
      bottom: element.getBoundingClientRect().bottom,
      viewport: window.innerHeight,
    }));
    expect(metrics.viewport).toBe(667);
    expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewport);

    await mockAPI.clearAllMocks();
  });
});
