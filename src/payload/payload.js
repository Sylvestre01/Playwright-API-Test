export default class Payloads {

    create_post() {
        return {
            data: {
                title: 'Vibes',
                body: 'Nigeria is a great place to visit',
                userId: "3"
            }
        }
    }

    update_post() {
        return {
            data: {
                title: 'Technology',
            }
        }
    }
}