import * as _ from "lodash"
import * as net from "net"
import Log from "./Log"
import Mapping from "./Mapping"
import TcpClient from "./TcpClient"

class ReproxyServer {
  private mappingList: Mapping[] = []

  constructor() {
    // add config
  }

  public add = (from: string, to: string) => {
    Log.info(`mapping from ${from} to ${to} added`)
    this.mappingList.push(new Mapping(from, to))
  }

  public startHttp = () => {
    const httpServer = new net.Server(this.onConnect)
    httpServer.on("error", this.onError)
    httpServer.listen(80)
    Log.info("http server started")
  }

  public startHttps = () => {
    const httpsServer = new net.Server(this.onConnect)
    httpsServer.on("error", this.onError)
    httpsServer.listen(443)
    Log.info("https server started")
  }

  public startAll = () => {
    this.startHttp()
    this.startHttps()
  }

  private onConnect = (socket: net.Socket) => {
    const item = _.find(this.mappingList, {from: socket.localAddress})
    if (!item) {
      Log.info(`no host found for address ${socket.localAddress}`)
      socket.end()
      return
    }
    new TcpClient(socket, item.to).start()
  }

  private onError = (err: Error) => {
     Log.info(err)
  }
}

export default ReproxyServer
