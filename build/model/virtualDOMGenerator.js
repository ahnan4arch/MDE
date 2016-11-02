"use strict";
const vElement_1 = require("../virtualDOM/vElement");
class VirtualDOMGenerator {
    constructor(textModel) {
        this.root = new vElement_1.VElement("div", null, []);
        this.textModel = textModel;
    }
    generate() {
        for (let i = 1; i <= this.textModel.linesCount; i++) {
            let lineElm = new vElement_1.VElement("div", null, []);
            let lineSpan = new vElement_1.VElement("span", null, []);
            lineElm.children.push(lineSpan);
            lineSpan.children.push(this.textModel.lineAt(i).text);
            this.root.children.push(lineElm);
        }
        return this.root;
    }
}
exports.VirtualDOMGenerator = VirtualDOMGenerator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC92aXJ0dWFsRE9NR2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSwyQkFBdUIsd0JBRXZCLENBQUMsQ0FGOEM7QUFFL0M7SUFLSSxZQUFZLFNBQW9CO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUVELFFBQVE7UUFDSixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFaEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0FBRUwsQ0FBQztBQXZCWSwyQkFBbUIsc0JBdUIvQixDQUFBIiwiZmlsZSI6Im1vZGVsL3ZpcnR1YWxET01HZW5lcmF0b3IuanMiLCJzb3VyY2VSb290Ijoic3JjLyJ9
