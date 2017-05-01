import Link from 'next/link'
import React, { Component } from 'react'
import { Head, Nav } from '../components'

export default class extends Component{
  constructor(){
    super()

    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onError = this.onError.bind(this)
  }

  state = { list: [] }

  wsUri = "wss://frigo.io/"
  // wsUri = "ws://localhost:3000/"

  apiUri = "https://frigo.io/1bd5807e-21de-4fbd-9002-87b71bee1b3f"
  // apiUri = "http://localhost:3000/33857227-d9a9-4fbd-9b3b-add2d7d4f56a"

  componentDidMount(){
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = this.onOpen
    this.websocket.onclose = this.onClose
    this.websocket.onmessage = this.onMessage
    this.websocket.onerror = this.onError
  }

  onOpen(evt) {
    console.log("CONNECTED");
  }

  onClose() {
    console.log("DISCONNECTED");
  }

  onMessage(evt) {
    console.log("MESSAGE: ", evt.data);
    this.setState({ list: JSON.parse(evt.data) })
  }

  onError(evt) {
    console.error(evt.data)
  }

  doSend(message) {
    console.log("SENT: " + message);
    websocket.send(message);
  }

  removeTodo({ _id: id }){
    fetch(this.apiUri, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "remove",
        id
      })
    })
  }

  componentWillUnmount(){
    this.onClose()
  }

  render(){
    return (
      <div>
        <Head title="Home" />
        <Nav />

        <div className="hero">
          <h1 className="title">ls-it</h1>
          <p className="description">Add stuff when you think of them!</p>

          <div className="row">
            <ul>
              {
                this.state.list.map(item => 
                  <li 
                    key={item._id}
                    onClick={this.removeTodo.bind(this, item)}
                  >
                    {item.item}
                  </li>
                )
              }
            </ul>
          </div>
        </div>

        <style jsx>{`
          .hero {
            width: 100%;
            color: #333;
          }
          .title {
            margin: 0;
            width: 100%;
            padding-top: 80px;
            line-height: 1.15;
            font-size: 48px;
          }
          .title, .description {
            text-align: center;
          }
          .row {
            max-width: 880px;
            margin: 80px auto 40px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }
        `}</style>
      </div>
    )
  }
}
