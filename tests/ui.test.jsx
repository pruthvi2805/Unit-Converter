import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from '../src/pages/HomePage'
import ConverterPage from '../src/pages/ConverterPage'
import { categories } from '../src/data/converterRegistry'

const lengthCategory = categories.find((category) => category.slug === 'length')
const kilometersToMiles = lengthCategory.converters.find((converter) => converter.slug === 'km-to-miles')

const timeCategory = categories.find((category) => category.slug === 'time')
const durationCalculator = timeCategory.converters.find((converter) => converter.slug === 'duration-calculator')

describe('ui flows', () => {
  it('lets users search from the homepage and navigate to a converter', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/length/km-to-miles" element={<div>Kilometers to Miles page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByRole('combobox', { name: /search converters/i }), 'km to miles')
    await user.click(await screen.findByRole('option', { name: /kilometers to miles/i }))

    expect(await screen.findByText('Kilometers to Miles page')).toBeInTheDocument()
  })

  it('fills an example chip and shows a result summary on converter pages', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ConverterPage converter={kilometersToMiles} category={lengthCategory} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: '5' }))

    await waitFor(() => {
      expect(screen.getByDisplayValue(/3\.106855|3\.10686|3\.107/)).toBeInTheDocument()
    })

    expect(screen.getByText(/^5 km =/i)).toBeInTheDocument()
  })

  it('shows explicit validation guidance for malformed duration input', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ConverterPage converter={durationCalculator} category={timeCategory} />
      </MemoryRouter>,
    )

    const input = screen.getByLabelText(/from/i)
    await user.clear(input)
    await user.type(input, 'abc')

    expect(screen.getAllByText(/use hh:mm:ss values with \+, -, or \*/i).length).toBeGreaterThan(0)
  })
})
