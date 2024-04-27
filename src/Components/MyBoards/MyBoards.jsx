import { useState } from 'react';
import './MyBoards.css'

const items = [
  {id: 1, text: 'На день рождения', dateAddet: '19.06'},
  {id: 2, text: 'Новоселье', dateAddet: '12.12'},
  {id: 3, text: 'В гардероб', dateAddet: '01.01'},
]



const MyBoards = () => {
  const [boardsList, setBoardsList] = useState(items);    

  const addNewBoard = () => {
    let nextId = boardsList.length == 0 ? 0 : boardsList[boardsList.length-1].id + 1
    let date = new Date().getDate()
    let month = new Date().getMonth()
    month++;    
    let newBoard = {
      id: nextId,
      text: `новая доска ${nextId}`,
      dateAddet: `${date}.${month.toString().length == 1 ? '0'+month : month}`,
    }
    setBoardsList([
      ...boardsList,
      newBoard
    ]);
  }

  const deleteBoardById = (id) => {
    setBoardsList(boardsList.filter(b=>b.id!==id));
  }

  console.log(boardsList);
  return(
    <div className='my-boards'>
      <div className="my-boards__container">
        <div className='my-boards__header'>
          <div className='my-boards__header__container'>
            <div className='my-boards__header__item'>
              <div className='my-boards__header__item_blue'>Мои доски</div>
              <div>Всего досок {boardsList.length}</div>
            </div>
            <div className='my-boards__header__item'>
              <button onClick={addNewBoard}>Новая доска</button>
            </div>
          </div>
        </div>
        <div className='my-boards__boards'>
          <div className='my-boards__boards__container'>
            {boardsList.map(b=>
                <Board
                  className='my-boards__boards__item'
                  key={b.id}
                  id={b.id}
                  text={b.text}
                  dateAddet={b.dateAddet}
                  handleDeleteItem={() => deleteBoardById(b.id)}
                />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Board = ({className, text, dateAddet, handleDeleteItem}) => {
  return (
    <div className={className}>
      <div>{text}</div>
      <div>{dateAddet}</div>
      <button
        style={{
          borderRadius: '5px',
          border: '1px solid red',
          padding: '5px'
        }}
        onClick={handleDeleteItem}
      >
        удалить
      </button>
    </div>
  )
}

export default MyBoards;