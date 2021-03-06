import * as acorn from "acorn";
import * as estree from "estree-walker";
import { debug } from "console";
let jsx = require("acorn-jsx");

/**
 *  return  an AST for each file in the program.
 * @param files 
 */
const constructAST = async (files: any[]) => {
    const astList: any[] = [];
    for (const file of files) {
        const ast = await new Promise((resolve, _) =>
            file.getContent((jsCode: string) => {
                const ast: any = acorn.Parser.extend(jsx()).parse(jsCode, { ranges: false, locations: false, sourceType: "module" });
                return resolve({ tree: ast, file: file.url });
            }))
        astList.push(ast);
    }
    return astList
}
/**
 *  return ASTs for only the code that got executed.
 * @param coverage 
 * @param files 
 */
const analyzeCode = async (coverage: any, files: string[]) => {
    const relevantAST: Object[] = [];
    const executionTrace: String[] = [];
    const astList = await constructAST(files);
    for (const ast of astList) {
        const filename = ast.file.substring(ast.file.lastIndexOf("/") + 1, ast.file.lastIndexOf(".js"));
        estree.walk(ast.tree, {
            enter: (node: any, parent: any, prop: any, index: any) => {
                switch (node.type) {
                    case "ImportDeclaration":
                        relevantAST.push({ node, filename });
                        break;
                    case "FunctionDeclaration": {
                        const index = coverage.findIndex((e: any) => e.functionName === node.id.name);
                        if (index > -1) {
                            relevantAST.push({ node, filename });
                            executionTrace.push(`<code>${node.id.name}</code> inside <code>${filename}</code> got executed.`);
                        }
                    }
                        break;
                    case "ArrowFunctionExpression": {
                        const index = coverage.findIndex((e: any) => e.functionName === node.body.callee?.name);
                        if (index > -1) {
                            relevantAST.push({ node, filename });
                            executionTrace.push(`<code>${node.body.callee?.name}</code> inside <code>${filename}</code> got executed.`);
                        }
                    }
                        break;
                    case "JSXOpeningElement": {
                        const index = coverage.findIndex((e: any) => {
                             return e.functionName === node.name.name || node.attributes.find((node:any) =>  e.functionName === node.name.name)
                            });
                        if (index > -1) {
                            relevantAST.push({ node, filename });
                            executionTrace.push(`<code>${node.name.name}</code> inside <code>${filename}</code> got executed.`);

                        }
                    }
                }
            }
        })
    }
    return [relevantAST, executionTrace];
}



export { analyzeCode, constructAST }