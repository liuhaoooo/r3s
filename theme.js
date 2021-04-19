const { generateTheme } = require('antd-theme-generator');
const path = require('path');
const options = {
    antDir: path.join(__dirname, './node_modules/ant-design-vue'),
    stylesDir: path.join(__dirname, './src/assets/style/theme'), // all files with .less extension will be processed
    varFile: path.join(__dirname, './src/assets/style/theme/variables.less'), // default path is Ant Design default.less file
    mainLessFile: path.join(__dirname, './src/assets/style/theme/index.less'), //对应具体位置
    themeVariables: [
        '@primary-color',
        '@component-background',
    ],
    indexFileName: "index.html",
    outputFilePath: path.join(__dirname, './public/color.less'), // if provided, file will be created with generated less/styles
}

generateTheme(options).then(less => {
    console.log('Theme generated successfully');
}).catch(error => {
    console.log('Error', error);
})