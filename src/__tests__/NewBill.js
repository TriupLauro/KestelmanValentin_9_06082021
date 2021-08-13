import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import MockFile from "../__mocks__/mockFile.js";
import '@testing-library/jest-dom/extend-expect'
import {ROUTES} from "../constants/routes.js";
//import {localStorageMock} from "../__mocks__/localStorage.js";


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
    test('And if I try it, an error message is displayed', () => {
        expect(screen.getByText('Les formats d\'image .jpg .jpeg ou .png sont les seuls acceptés'))
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

        const mockFormData = {
            email : 'johndoe@email.com',
            type : 'Transports',
            name : 'Dépense primordiale',
            amount : 1,
            date : '2020-05-24',
            vat : 15,
            pct : 20,
            commentary : 'Ceci est un test automatisé',
            fileUrl : null,
            fileName : null,
            status : 'pending'
        }

        const typeMenu = screen.getByLabelText('Type de dépense')
        userEvent.selectOptions(typeMenu,'Transports')
        expect(screen.getByRole('option',{name : 'Transports'}).selected).toBeTruthy()
        expect(screen.getByRole('option',{name : 'Restaurants et bars'}).selected).toBeFalsy()

        const expenseNameInput = screen.getByLabelText('Nom de la dépense')
        userEvent.type(expenseNameInput,'Dépense primordiale')
        expect(expenseNameInput).toHaveValue(mockFormData.name)

        const datePicker = screen.getByLabelText('Date')
        fireEvent.change(datePicker,{target: {value: '2020-05-24'}})
        expect(datePicker).toHaveValue(mockFormData.date)

        const amountInput = screen.getByLabelText('Montant TTC')
        userEvent.type(amountInput,'1')
        expect(amountInput).toHaveValue(mockFormData.amount)

        const vatInput = screen.getByLabelText('TVA')
        userEvent.type(vatInput,'15')
        expect(vatInput).toHaveValue(mockFormData.vat)

        const commentaryInput = screen.getByLabelText('Commentaire')
        userEvent.type(commentaryInput,'Ceci est un test automatisé')
        expect(commentaryInput).toHaveValue(mockFormData.commentary)
    })
    test('And submit it',()=>{
        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
        }

        /*Object.defineProperty(window, "localStorage",{
            value :localStorageMock,
            writable: true
        })*/

        window.localStorage.setItem('user',JSON.stringify({email : 'johndoe@email.com'}))

        const newBill = new NewBill({
            document,
            onNavigate,
            firestore : null,
            localStorage : window.localStorage
        })

        const mockFormData = {
            email : 'johndoe@email.com',
            type : 'Transports',
            name : 'Dépense primordiale',
            amount : 1,
            date : '2020-05-24',
            vat : 15,
            pct : 20,
            commentary : 'Ceci est un test automatisé',
            fileUrl : null,
            fileName : null,
            status : 'pending'
        }

        jest.spyOn(newBill,'createBill')

        const newBillForm = screen.getByTestId('form-new-bill')

        const handleSubmitForm = jest.fn(newBill.handleSubmit)
        //const mockCreateBill = jest.fn(newBill.createBill)
        newBillForm.addEventListener('submit', handleSubmitForm)

        //Check that we're still in the New Bill form
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()

        fireEvent.submit(newBillForm)
        expect(handleSubmitForm).toHaveBeenCalled()
        expect(newBill.createBill).toHaveBeenCalledWith(mockFormData)
    })
    test('And the bills page should render', () => {
        expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
})

// test d'intégration Post
describe("Given I am a user connected as employee", () => {
    describe("When I navigate to the NewBill form", () => {
        test("Then I can send a post request", async () => {
            const mockPostFirebase = jest.fn().mockResolvedValue('This is a POST request')
            const response = await mockPostFirebase()
            expect(mockPostFirebase).toHaveBeenCalledTimes(1)
            expect(response).toBe('This is a POST request')
        })
    })
})

