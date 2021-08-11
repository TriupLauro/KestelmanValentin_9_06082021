import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import MockFile from "../__mocks__/mockFile.js";
import '@testing-library/jest-dom/extend-expect'
import {ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can try to upload an image", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
          document,
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)

      const mock = new MockFile()
      const file = mock.create('sunglasses.gif',1024*4,'image/gif')

      const fileBtn = screen.getByLabelText('Justificatif')
      fileBtn.addEventListener('change', handleChangeFile)

      userEvent.upload(fileBtn,file)

      expect(handleChangeFile).toHaveBeenCalled()
    })
    test('Then I cannot submit an image with an invalid extension', () => {
      document.body.innerHTML = NewBillUI()

      const mockEvent = {
        target: {
          value: 'sunglasses.gif'
        }
      }

      const newBill = new NewBill({document})
      newBill.handleChangeFile(mockEvent)
      expect(mockEvent.target.value).toBe(null)
    })
    test('Then I can submit an image with a valid extension', () => {
      document.body.innerHTML = NewBillUI()
      const fileName = 'sunglasses.jpg'

      const mockEvent = {
        target: {
          value: fileName
        }
      }

      const newBill = new NewBill({document})
      newBill.handleChangeFile(mockEvent)
      expect(mockEvent.target.value).toBe(fileName)
    })
    test('Then I can fill the form', ()=>{
        document.body.innerHTML = NewBillUI()
        const typeMenu = screen.getByLabelText('Type de dépense')
        userEvent.selectOptions(typeMenu,'Transports')
        expect(screen.getByRole('option',{name : 'Transports'}).selected).toBeTruthy()
        expect(screen.getByRole('option',{name : 'Restaurants et bars'}).selected).toBeFalsy()

        const expenseNameInput = screen.getByLabelText('Nom de la dépense')
        userEvent.type(expenseNameInput,'Dépense primordiale')
        expect(expenseNameInput).toHaveValue('Dépense primordiale')

        const datePicker = screen.getByLabelText('Date')
        fireEvent.change(datePicker,{target: {value: '2020-05-24'}})
        expect(datePicker.value).toBe('2020-05-24')

        const amountInput = screen.getByLabelText('Montant TTC')
        userEvent.type(amountInput,'1')
        expect(amountInput.value).toBe('1')

        const vatInput = screen.getByLabelText('TVA')
        userEvent.type(vatInput,'15')
        expect(vatInput.value).toBe('15')

        const commentaryInput = screen.getByLabelText('Commentaire')
        userEvent.type(commentaryInput,'Ceci est un test automatisé')
        expect(commentaryInput.value).toBe('Ceci est un test automatisé')
    })
    test('And submit it',()=>{
        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
        }

        Object.defineProperty(window, "localStorage",{
            value :localStorageMock,
            writable: true
        })
        window.localStorage.setItem('user',JSON.stringify({email : 'johndoe@email.com'}))

        const newBill = new NewBill({
            document,
            onNavigate,
            firestore : null,
            localStorage : window.localStorage
        })
        const newBillForm = screen.getByTestId('form-new-bill')

        const handleSubmitForm = jest.fn(newBill.handleSubmit)
        //const mockCreateBill = jest.fn(newBill.createBill)
        newBillForm.addEventListener('submit', handleSubmitForm)

        fireEvent.submit(newBillForm)
        expect(handleSubmitForm).toHaveBeenCalled()
        //expect(mockCreateBill).toHaveBeenCalled()
    })
    test('And the bills page should render', () => {
        expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
})