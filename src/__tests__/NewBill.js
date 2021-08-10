import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import MockFile from "../__mocks__/mockFile.js";
//import {ROUTES} from "../constants/routes";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can try to upload an image", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const newBill = new NewBill({document})

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
  })
})