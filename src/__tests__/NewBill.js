import {screen, fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import MockFile from "../__mocks__/mockFile.js";
import '@testing-library/jest-dom/extend-expect'
import {ROUTES} from "../constants/routes.js";
import BillsUI from "../views/BillsUI";
//import {localStorageMock} from "../__mocks__/localStorage.js";

const mockFormData = {
    email: 'johndoe@email.com',
    type: 'Services en ligne',
    name: 'Dépense primordiale',
    amount: 1,
    date: '2020-05-24',
    vat: 15,
    pct: 20,
    commentary: 'Ceci est un test automatisé',
    fileUrl: null,
    fileName: null,
    status: 'pending'
}

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then I can try to upload an image", () => {
            document.body.innerHTML = NewBillUI()

            const newBill = new NewBill({
                document,
            })

            const handleChangeFile = jest.fn(newBill.handleChangeFile)

            const mock = new MockFile()
            const file = mock.create('sunglasses.jpg', 1024 * 4, 'image/jpeg')

            const fileBtn = screen.getByLabelText('Justificatif')
            fileBtn.addEventListener('change', handleChangeFile)

            userEvent.upload(fileBtn, file)

            expect(handleChangeFile).toHaveBeenCalled()
        })
        test('Then I cannot submit an image with an invalid extension, and get an error message', () => {
            document.body.innerHTML = NewBillUI()

            const mockEvent = {
                target: {
                    value: 'sunglasses.gif'
                }
            }

            const newBill = new NewBill({document})
            newBill.handleChangeFile(mockEvent)
            expect(mockEvent.target.value).toBe(null)
            expect(screen.getByText('Les formats d\'image .jpg .jpeg ou .png sont les seuls acceptés')).toBeInTheDocument()
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
        test('Then I can fill the form', () => {
            document.body.innerHTML = NewBillUI()

            const typeMenu = screen.getByLabelText('Type de dépense')
            userEvent.selectOptions(typeMenu, 'Services en ligne')
            expect(screen.getByRole('option', {name: 'Transports'}).selected).toBeFalsy()
            expect(screen.getByRole('option', {name: 'Restaurants et bars'}).selected).toBeFalsy()
            expect(screen.getByRole('option', {name: 'Services en ligne'}).selected).toBeTruthy()

            const expenseNameInput = screen.getByLabelText('Nom de la dépense')
            userEvent.type(expenseNameInput, 'Dépense primordiale')
            expect(expenseNameInput).toHaveValue(mockFormData.name)

            const datePicker = screen.getByLabelText('Date')
            fireEvent.change(datePicker, {target: {value: '2020-05-24'}})
            expect(datePicker).toHaveValue(mockFormData.date)

            const amountInput = screen.getByLabelText('Montant TTC')
            userEvent.type(amountInput, '1')
            expect(amountInput).toHaveValue(mockFormData.amount)

            const vatInput = screen.getByLabelText('TVA')
            userEvent.type(vatInput, '15')
            expect(vatInput).toHaveValue(mockFormData.vat)

            const commentaryInput = screen.getByLabelText('Commentaire')
            userEvent.type(commentaryInput, 'Ceci est un test automatisé')
            expect(commentaryInput).toHaveValue(mockFormData.commentary)
        })
        test('Then I can submit the filled form', () => {
            document.body.innerHTML = NewBillUI()

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            /*Object.defineProperty(window, "localStorage",{
                value :localStorageMock,
                writable: true
            })*/

            window.localStorage.setItem('user', JSON.stringify({email: 'johndoe@email.com'}))

            const newBill = new NewBill({
                document,
                onNavigate,
                firestore: null,
                localStorage: window.localStorage
            })

            const typeMenu = screen.getByLabelText('Type de dépense')
            userEvent.selectOptions(typeMenu, 'Services en ligne')
            const expenseNameInput = screen.getByLabelText('Nom de la dépense')
            userEvent.type(expenseNameInput, 'Dépense primordiale')
            const datePicker = screen.getByLabelText('Date')
            fireEvent.change(datePicker, {target: {value: '2020-05-24'}})
            const amountInput = screen.getByLabelText('Montant TTC')
            userEvent.type(amountInput, '1')
            const vatInput = screen.getByLabelText('TVA')
            userEvent.type(vatInput, '15')
            const commentaryInput = screen.getByLabelText('Commentaire')
            userEvent.type(commentaryInput, 'Ceci est un test automatisé')

            jest.spyOn(newBill, 'createBill')

            const newBillForm = screen.getByTestId('form-new-bill')

            const handleSubmitForm = jest.fn(newBill.handleSubmit)
            //const mockCreateBill = jest.fn(newBill.createBill)
            newBillForm.addEventListener('submit', handleSubmitForm)

            //Check that we're still in the New Bill form
            expect(screen.getByText('Envoyer une note de frais')).toBeInTheDocument()

            fireEvent.submit(newBillForm)
            expect(handleSubmitForm).toHaveBeenCalled()
            expect(newBill.createBill).toHaveBeenCalledWith(mockFormData)
        })
        test("Then I'm sent to the Bills page after submitting the form", () => {
            document.body.innerHTML = NewBillUI()

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }

            window.localStorage.setItem('user', JSON.stringify({email: 'johndoe@email.com'}))

            const newBill = new NewBill({
                document,
                onNavigate,
                firestore: null,
                localStorage: window.localStorage
            })

            const newBillForm = screen.getByTestId('form-new-bill')

            //Check that we're still in the New Bill form
            expect(screen.getByText('Envoyer une note de frais')).toBeInTheDocument()

            fireEvent.submit(newBillForm)

            expect(screen.queryByText('Envoyer une note de frais')).not.toBeInTheDocument()
            expect(screen.getByText('Mes notes de frais')).toBeInTheDocument()
        })
    })
})

// test d'intégration Post
describe("Given I am a user connected as employee", () => {
    describe("When I navigate to the NewBill form", () => {
        test("Then I can send a post request", async () => {
            document.body.innerHTML = NewBillUI()

            const onNavigate = (pathname,error) => {
                document.body.innerHTML = ROUTES({pathname,error})
            }

            const mockFirestore = {
                bills : jest.fn().mockReturnThis(),
                add : jest.fn().mockImplementation(bill => new Promise(resolve => resolve(`${bill.name} added`)))
            }

            const newBill = new NewBill({
                document,
                onNavigate,
                firestore: mockFirestore,
                localStorage: window.localStorage
            })

            await newBill.createBill(mockFormData)
            expect(mockFirestore.add).toHaveBeenCalledWith(mockFormData)
            expect(screen.getByText('Mes notes de frais')).toBeInTheDocument()
        })
        test("Then the post request fails with a 404 error message", async () => {
            document.body.innerHTML = NewBillUI()

            const onNavigate = (pathname, err) => {
                document.body.innerHTML = ROUTES({pathname, error : err})
            }

            const error = new Error("Erreur 404")

            const mockFirestore = {
                bills : jest.fn().mockReturnThis(),
                add : jest.fn().mockImplementation(() => Promise.reject(error))
            }

            const newBill = new NewBill({
                document,
                onNavigate,
                firestore: mockFirestore,
                localStorage: window.localStorage
            })

            await newBill.createBill(mockFormData)
            document.body.innerHTML = BillsUI({error})
            expect(screen.getByText(/Erreur 404/)).toBeInTheDocument()
        })
    })
})

