import { Component } from 'react';
import './MyBoards.css'

export default class MyBoards extends Component {  
  state = {
    items: [
      {id: 1, text: 'На день рождения', dateAddet: '19.06'},
      {id: 2, text: 'Новоселье', dateAddet: '12.12'},
      // {id: 3, text: 'В гардероб', dateAddet: '01.01'},
    ],    
  }  

  addNewItem = () => {      
    let nextId = this.state.items.length == 0 ? 0 : this.state.items[this.state.items.length-1].id + 1
    let date = new Date().getDate()
    let month = new Date().getMonth()
    month++;    
    this.setState({
      items: [
        ...this.state.items,
        {
          id: nextId,
          text: `новая доска ${nextId}`,
          dateAddet: `${date}.${month.toString().length == 1 ? '0'+month : month}`,
        }
      ]
    });
  }

  deleteItemById(id){
    this.setState({
      items: this.state.items.filter(i=>i.id!==id)
    });
  }

  render(){    
    return(
      <div className='my-boards'>
        <div className="my-boards__container">
          <div className='my-boards__header'>
            <div className='my-boards__header__container'>
              <div className='my-boards__header__item'>
                <div className='my-boards__header__item_blue'>Мои доски</div>
                <div>Всего досок {this.state.items.length}</div>
              </div>
              <div className='my-boards__header__item'>
                <button onClick={this.addNewItem}>Новая доска</button>
              </div>
            </div>
          </div>
          <div className='my-boards__boards'>
            <div className='my-boards__boards__container'>
              {this.state.items.map(i=>
                  <Board
                    className='my-boards__boards__item'
                    key={i.id}
                    id={i.id}
                    text={i.text}
                    dateAddet={i.dateAddet}
                    handleDeleteItem={() => this.deleteItemById(i.id)}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Board extends Component {
  render(){
    return (
      <div className={this.props.className}>
        <div>{this.props.text}</div>
        <div>{this.props.dateAddet}</div>
        <button  
          style={{            
            borderRadius: '5px',
            border: '1px solid red',
            padding: '5px'
          }}        
          onClick={this.props.handleDeleteItem}
        >
          удалить
        </button>
      </div>
    )
  }
}