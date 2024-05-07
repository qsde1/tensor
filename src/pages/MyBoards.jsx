import {
    Layout,
    Button,
    Flex,
    Card,
} from "antd"
import { useContext, useState } from "react"
import { myBoardsContext, setMyBoardsContext } from "../contexts/boardsContext"
import Header from "../components/Header"

const MyBoards = () => {
    const boardsContext = useContext(myBoardsContext);
    const setBoardsContext = useContext(setMyBoardsContext);

    function createBoard(){
        const id = boardsContext.length == 0 ? 0 : boardsContext[boardsContext.length-1].id + 1
        let newBoard = {
            id,
            name: `новая доска ${id}`,
            description: 'ну типо описание такое прикольное'
        }
        setBoardsContext([
            ...boardsContext,
            newBoard
        ])
    }

    return (
        <>
            <Layout>
                <Header>
                    <div>Мои доски</div>
                    <div>
                        <Button
                            onClick={createBoard}
                        >
                            Новая доска
                        </Button>
                    </div>
                </Header>
                <Layout.Content style={{
                    padding: "0 5px",
                }}>
                    <Flex
                        gap='1%'
                        wrap
                    >
                        {boardsContext.map(b => 
                            <Board
                                key={b.id}
                                board={b}
                            />
                        )}
                    </Flex>
                </Layout.Content>
            </Layout>
        </>
    )
}

export default MyBoards


const Board = ({board}) => {
    return (
        <Card
            style={{
                width: '49%',
                margin: '0 0 30px 0'
            }}
            title={board.name}
            hoverable
        >
            {board.description}
        </Card>
    )
}