import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Bills from "../containers/Bills.js";
import {ROUTES} from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe('When the bills page is loading', ()=> {
    test('Then the loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({loading: true})
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am the bills page but there is an error', ()=> {
    test('Then an error should be displayed', () => {
      document.body.innerHTML = BillsUI({error: 'some error message'})
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
  describe('When I click on the new Bill button', () => {
    test('Then I should navigate to the new Bill Form', () => {
      document.body.innerHTML = BillsUI({ data: []})

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const bill = new Bills({
        document,
        onNavigate
      })

      const newBillBtn = screen.getByRole('button')
      const handleBtnClick = jest.fn(bill.handleClickNewBill)
      newBillBtn.addEventListener('click', handleBtnClick)

      userEvent.click(newBillBtn)
      expect(handleBtnClick).toHaveBeenCalled()
    })

    test("And it should renders the new bill form", () => {
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //We need to specify the type of user in order for the vertical layout to load correctly
      window.localStorage.setItem('user',JSON.stringify({type : 'Employee'}))

      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
      const billIcon = screen.getByTestId('icon-window')
      expect(billIcon).toHaveClass('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then bill information should be displayed", () =>{
      const testBill = bills[0]
      document.body.innerHTML = BillsUI({data: bills})
      expect(screen.getByText(testBill.name)).toBeTruthy()
      expect(screen.getByText(testBill.date)).toBeTruthy()
      expect(screen.getByText(testBill.type)).toBeTruthy()
      expect(screen.getByText(`${testBill.amount.toString(10)} €`)).toBeTruthy()
      expect(screen.getByText(testBill.status)).toBeTruthy()
    })
    test("Then by clicking on the blue eye icon, a modal should open",() =>{
      document.body.innerHTML = BillsUI({data: bills})
      const blueEyeIcon = screen.getAllByTestId('icon-eye')[0]
      expect(blueEyeIcon).toBeTruthy()

      const bill = new Bills({document})
      const handleClickIconEye = jest.fn(e => bill.handleClickIconEye(blueEyeIcon))
      expect(blueEyeIcon).toHaveAttribute('data-bill-url')
      blueEyeIcon.addEventListener('click',handleClickIconEye)

      userEvent.click(blueEyeIcon)
      expect(handleClickIconEye).toHaveBeenCalled()

    })
  })
})