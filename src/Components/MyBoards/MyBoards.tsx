import { useState  } from 'react';
import './MyBoards.css'


type board = {
  id: number;
  text: string;
  // dateAddet сделать тип дата
  dateAddet: string; 
}

let items: board[] = [
  {id: 1, text: 'На день рождения', dateAddet: '19.06'},
  {id: 2, text: 'Новоселье', dateAddet: '12.12'},
  {id: 3, text: 'В гардероб', dateAddet: '01.01'},
]

const MyBoards = () => {
  const [boardsList, setBoardsList] = useState<board[]>(items)

  const addNewItem = (): void => {      
    let nextId:number = boardsList.length == 0 ? 0 : boardsList[boardsList.length-1].id + 1;
    let date:number = new Date().getDate();
    let month:number = new Date().getMonth();
    month++;

    let newBoard:board = {
      id: nextId,
      text: `новая доска ${nextId}`,
      dateAddet: `${date}.${month.toString().length == 1 ? '0'+month : month}`,
    }

    setBoardsList([
        ...boardsList,
        newBoard
      ]
    );
  }

  const deleteItemById = (id:number):void => {
    setBoardsList(boardsList.filter((b:board)=>b.id !== id));
  } 
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
              <button onClick={addNewItem}>Новая доска</button>
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
                  handleDeleteItem={() => deleteItemById(b.id)}
                />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type BoardProps = {
  id: number,
  className: string;
  text: string;
  //сделать датой
  dateAddet: string;
  handleDeleteItem: () => void;
}

const Board = ({className, text, dateAddet, handleDeleteItem}: BoardProps) => {  
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


export default MyBoards