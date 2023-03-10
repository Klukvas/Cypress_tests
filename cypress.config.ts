import { defineConfig } from "cypress";
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'https://findmydoctor.mass.gov/', //https://github.com/cypress-io/cypress/issues/2542
    defaultCommandTimeout: 6000,
    experimentalInteractiveRunEvents: true,
    screenshotsFolder: path.join('cypress','output'),
    video: false,
    trashAssetsBeforeRuns: false,
    env: {
      pathToOutput: path.join('cypress','output', "data.json")
    },
    setupNodeEvents(on, config) {
        on('before:spec', (details) => {
          let fullPath = config['env']['pathToOutput']
          let parentPath = path.join( './', path.dirname( fullPath) ) 
          if(!fs.existsSync(parentPath)){
            fs.mkdirSync(parentPath, {recursive: true})
          }
          if(!fs.existsSync(fullPath)){
            fs.writeFileSync(fullPath, JSON.stringify([]))
          }
        })
        // on('after:screenshot', (details) => {
        //   console.log(details)
        //   let newFilePath = path.join( 
        //     path.dirname(path.dirname(details.path)),
        //     `${details.specName}--${details.name}.png`

        //   )
        //   fs.rename(details.path, newFilePath, (err) => {
        //       if(err) throw err
        //   })
        // })
        // on('task', {

        //   writeFail(dataToWrite:object){
        //     console.log('HERE WE GOOOOOOO', dataToWrite)
        //     fs.writeFileSync('/Users/apavlenko/Desktop/interview_web_scraper-main/cypress/output/data.json', JSON.stringify(dataToWrite))
        //     fs.writeFileSync('cypress/output/data.json', JSON.stringify(dataToWrite))
        //     fs.writeFileSync('data.json', JSON.stringify(dataToWrite))
        //     return null
        //   }
        // })

      // on('task', {
      //   readFileMaybe(filename) {
      //     let pathToParentFolder = path.join( './', ...filename.split('/').slice(0, -1))
      //     if(!fs.existsSync(pathToParentFolder)){
      //       fs.mkdirSync(pathToParentFolder)
      //     }
      //     if (!fs.existsSync(filename)) {
      //       fs.writeFileSync(filename, JSON.stringify([]))
      //     }
      //     return fs.readFileSync(filename, 'utf8')
      //   },


      // })


    },
  },
});
