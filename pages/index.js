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
    this.removeTodo = this.removeTodo.bind(this)
    this.addTodo = this.addTodo.bind(this)
  }

  state = { list: [], text: "" }

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

  addTodo(item) {
    fetch(this.apiUri, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "add",
        item
      })
    })
    return true
  }

  componentWillUnmount(){
    this.onClose()
  }

  render(){
    return (
      <div id="app">
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
                    className="list-item"
                    onClick={this.removeTodo.bind(this, item)}
                  >
                    {item.item}
                  </li>
                )
              }
              <input
                type="text"
                value={this.state.text}
                onChange={e => this.setState({text: e.target.value})}
                onKeyDown={e => e.keyCode === 13 && this.addTodo(this.state.text) && this.setState({text: ""})}
              />
            </ul>
          </div>
        </div>

        <style jsx>{`
          @font-face {
            font-family: FixEmoji;
            unicode-range: U+20;
            src: local("Arial")
          }
          #app {
              -webkit-appearance: none;
              -webkit-text-size-adjust: 100%;
              -webkit-font-smoothing: antialiased;
              box-sizing: border-box;
              outline: none
              display: flex;
              flex-direction: column;
              height: 100%;
              font-family: FixEmoji, Roboto Mono, sans-serif;
              color: #111;
              font-size: 16px;
              height: 100vh;
              min-height: 100%;
              margin: 0;
              overflow: hidden;
              background: #f6f6f6;
              font-size: 20px;
          }
          #app::selection {
              background: rgba(51, 204, 51, .15)
          }
          a {
              color: #3c3;
              text-decoration: none
          }
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
          .list-item {
            list-style: none;
            cursor: pointer;
            padding: 10px;
          }
          .list-item:hover {
            text-decoration: line-through;
            color: #888
          }
        `}</style>
      </div>
    )
  }
}
