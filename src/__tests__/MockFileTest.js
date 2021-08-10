// mock file from : https://gist.github.com/josephhanson/372b44f93472f9c5a2d025d40e7bb4cc#file-mockfile-js
import MockFile from "../__mocks__/mockFile.js";

// mock file test harness
describe("Mock file for file upload testing", function () {
    it("should be defined", function() {
        var file = new MockFile();
        expect(file).not.toBeNull();
    });

    it("should have default values", function() {
        var mock = new MockFile();
        var file = mock.create();
        expect(file.name).toBe('mock.txt');
        expect(file.size).toBe(1024);
    });

    it("should have specific values", function () {
        var size = 1024 * 1024 * 2;
        var mock = new MockFile();
        var file = mock.create("pic.jpg", size, "image/jpeg");
        expect(file.name).toBe('pic.jpg');
        expect(file.size).toBe(size);
        expect(file.type).toBe('image/jpeg');
    });
});