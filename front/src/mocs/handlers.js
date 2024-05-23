import { http, HttpResponse } from 'msw'


export const handlers = [

    http.get('/', () => {
        return HttpResponse.json([{
            description: 'главная страница',
        }])
    }),

    http.get('/auth', () => {
        return HttpResponse.json([{
            user_id: '1',
        }])
    }),

    http.post('/registration', () => { 
        return HttpResponse.json({
            id: 1,
            password: 'pass123',
            repassword: 'pass123',
        })
    }),

    http.get('/boards', () => {
        return HttpResponse.json([{
            id: 1,
            name: 'доска 1',
            description: 'доска 1',
            img: 'rofl.jpg',
        }])
    }),

    http.post('/boards/create', () => {
        return HttpResponse.json({
            id: 1,
            name: 'доска 1',
            description: 'доска 1',
            img: 'rofl.jpg',
        })
    }),

    http.get('/boards/friends', () => { //тут даже объект в массиве мы крутые
        return HttpResponse.json([{
            id: 1,
            name: 'доска 1',
            description: 'доска 1',
            img: 'rofl.jpg',
        }])
    }),

    http.get('/boards/{board_id}', () => {
        return HttpResponse.json({
            id: 1,
            name: 'доска 1',
            description: 'доска 1',
            img: 'rofl.jpg',
        })
    }),

    http.post('/boards/{board_id}/edit', () => {
        return HttpResponse.json({
            id: 1,
            name: 'новая доска 1',
            description: 'доска 1',
            img: 'newrofl.jpg',
        })
    }),

    http.delete('/boards/{board_id}/delete', () => {
        return HttpResponse.json({
            id: 1,
            name: 'доска 1',
            description: 'доска 1',
            img: 'rofl.jpg',
        })
    }),

    http.get('/boards/reserved-gifts', () => {
        return HttpResponse.json({
            id: 1,
            name: 'подарок 1',
            description: 'подарок 1',
            img: 'gift.jpg',
            board_id: 1,
            src: 'url', //типо ссылка (но настоящая)
        })
    }),

    http.post('/gifts/create', () => {
        return HttpResponse.json({
            id: 1,
            name: 'подарок 1',
            description: 'подарок 1',
            img: 'gift.jpg',
            board_id: 1,
            src: 'url', //типо ссылка (но настоящая)
        })
    }),

    http.delete('/gifts/{gift_id}/delete', () => {
        return HttpResponse.json({
            id: 1,
            name: 'подарок 1',
            description: 'подарок 1',
            img: 'gift.jpg',
            board_id: 1,
            src: 'url', //типо ссылка (но настоящая)
        })
    }),

    http.post('/gifts/{gift_id}/edit', () => {
        return HttpResponse.json({
            id: 1,
            name: 'подарок 1',
            description: 'подарок 1',
            img: 'gift.jpg',
            board_id: 1,
            src: 'url', //типо ссылка (но настоящая)
        })
    }),

]