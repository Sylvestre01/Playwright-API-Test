export default class Payloads {

    create_post() {
        return {
            data: {
                title: 'Science',
                body: 'A miracle indeed!',
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