const levelController = require("../src/controllers/levelController");

let devs = require('../devs.json')
let lvl = require('../levels.json');

const testFunnc = (a,b)=>{
return (a+b)
}
test("myf",()=>{
    expect(testFunnc(1,2)).toBe(3)
})
//test('showAllLevels', () =>{
//    expect(levelController.showAllLevels()).toBe()
//})