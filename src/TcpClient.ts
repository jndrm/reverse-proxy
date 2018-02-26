import * as net from "net"
import Log from "./Log"

class TcpClient {

  private remoteSocket: net.Socket
  private localSocket: net.Socket
  private host: string

  constructor(socket: net.Socket, host: string) {
    this.remoteSocket = socket

    this.remoteSocket.pause()

    this.host = host
    this.localSocket = new net.Socket()

    this.remoteSocket.pipe(this.localSocket)
    this.localSocket.pipe(this.remoteSocket)

    this.remoteSocket.on("error", this.onError)
    this.remoteSocket.on("close", this.onClose)
    this.localSocket.on("timeout", this.onTimeout)
    this.localSocket.on("error", this.onError)
    this.localSocket.on("close", this.onClose)
  }

  public start = () => {
    const options = {
      family: 4,
      host: this.host,
      port: this.remoteSocket.localPort,
    }
    this.localSocket.connect(options, this.onConnect)
  }

  private onTimeout = () => {
    Log.info("timeout")
    this.stop()
  }

  private onError = (err: Error) => {
    Log.info(err)
    this.stop()
  }

  private onClose = () => {
    this.stop()
  }

  private stop = () => {
    if (this.remoteSocket) {
      this.remoteSocket.end()
      this.remoteSocket.destroy()
      this.remoteSocket = undefined
    }
    if (this.localSocket) {
      this.localSocket.end()
      this.localSocket.destroy()
      this.localSocket = undefined
    }
  }

  private onConnect = () => {
    this.remoteSocket.resume()
  }
}

export default TcpClient
