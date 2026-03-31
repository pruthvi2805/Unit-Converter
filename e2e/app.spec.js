import { expect, test } from '@playwright/test'

test('homepage search navigates to a converter', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox').fill('km to miles')
  await page.getByRole('option', { name: /kilometers to miles/i }).click()

  await expect(page.getByRole('heading', { name: 'Kilometers to Miles' })).toBeVisible()
})

test('converter example chips and swap work together', async ({ page }) => {
  await page.goto('/length/km-to-miles')
  await page.getByRole('button', { name: '5' }).click()

  await expect(page.getByText(/^5 km =/i)).toBeVisible()
  await page.getByRole('button', { name: /swap conversion direction/i }).click()

  await expect(page.locator('#converter-input')).toHaveValue(/3\.106855|3\.10686|3\.107/)
})

test('duration calculator surfaces invalid input guidance', async ({ page }) => {
  await page.goto('/time/duration-calculator')
  const input = page.locator('#converter-input')
  await input.fill('abc')

  await expect(page.locator('#converter-status')).toContainText(/use hh:mm:ss values with \+, -, or \*/i)
})

test('mobile category browse separates categories and converters', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Categories', exact: true }).click()
  await page.getByPlaceholder('Search categories or converters').fill('length')

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Categories', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Converters', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('link', { name: /length & distance 9 tools/i })).toBeVisible()
})
