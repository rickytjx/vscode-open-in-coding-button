import * as path from 'node:path'
import { bindAll, sortBy } from 'lodash-es'
import absolute from 'absolute'
import pify from 'pify'
import simpleGit from 'simple-git'
import { findUp } from 'find-up'
import * as vscode from 'vscode'
import Config from './config'

const Utils = {

  folder: {

    getRootPath(basePath?: any) {
      const { workspaceFolders } = vscode.workspace

      if (!workspaceFolders)
        return

      const firstRootPath = workspaceFolders[0].uri.fsPath

      if (!basePath || !absolute(basePath))
        return firstRootPath

      const rootPaths = workspaceFolders.map(folder => folder.uri.fsPath)
      const sortedRootPaths = sortBy(rootPaths, [(path: any) => path.length]).reverse() // In order to get the closest root

      return sortedRootPaths.find((rootPath: any) => basePath.startsWith(rootPath))
    },

    async getWrapperPathOf(rootPath: any, cwdPath: string, findPath: string) {
      const foundPath = await findUp(findPath, { cwd: cwdPath, type: 'directory' })

      if (foundPath) {
        const wrapperPath = path.dirname(foundPath)

        return wrapperPath
      }
    },

  },

  repo: {

    getGit(repopath: any) {
      return pify(bindAll(simpleGit(repopath), ['branch', 'getRemotes']))
    },

    async getHash(git: any) {
      return (await git.revparse(['HEAD'])).trim()
    },

    async getPath() {
      const { activeTextEditor } = vscode.window
      const editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath
      const rootPath = Utils.folder.getRootPath(editorPath)

      if (!rootPath)
        return false

      return await Utils.folder.getWrapperPathOf(rootPath, editorPath || rootPath, '.git')
    },

    async getUrl(git: any) {
      const config = Config.get()
      const remotes = await git.getRemotes(true)
      const remotesCODING = remotes.filter((remote: any) => (remote.refs.fetch || remote.refs.push).includes(config.coding.domain))
      const remoteOrigin = remotesCODING.filter((remote: any) => remote.name === config.remote.name)[0]
      const remote = remoteOrigin || remotesCODING[0]

      if (!remote)
        return

      const ref = remote.refs.fetch || remote.refs.push

      // CODING Remove the .git suffix (?:\.git|\/)?
      const re = /\.[^.:/]+[:/]([^/]+)\/(.*?)$/
      const match = re.exec(ref)

      if (!match)
        return

      return `https://${config.coding.domain}/${match[1]}/${match[2]}`
    },

  },

}

export default Utils
