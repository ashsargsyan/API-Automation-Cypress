import {faker} from "@faker-js/faker/locale/en";

describe('Resful-booker APIs', () => {
    let token, bookingId;
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const userCredentials = {
        username: "admin",
        password: "password123"
    }
    const userInfo = {
        firstname : firstname,
        lastname : lastname,
        totalprice : 111,
        depositpaid : true,
        bookingdates : {checkin : "2018-01-01", checkout : "2019-01-01"},
        additionalneeds : "Breakfast"
    }

    it('Create Token, Create Booking ID and Get Booking ID', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: userCredentials,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.token).exist;
            token = response.body.token;
            cy.log(token);
        }).then(() => {
            cy.request({
                method: 'POST',
                url: 'https://restful-booker.herokuapp.com/booking',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: userInfo,
            })
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.booking).to.have.property('firstname');
            expect(response.body.booking).to.have.property('lastname');
            expect(response.body.booking.firstname).to.eq(firstname);
            expect(response.body.booking.lastname).to.eq(lastname);
            bookingId = response.body.bookingid;
            cy.log(bookingId);
            cy.log(token);
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
            })
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('firstname');
            expect(response.body).to.have.property('lastname');
            expect(response.body.firstname).to.eq(firstname);
            expect(response.body.lastname).to.eq(lastname);
            expect(response.body.additionalneeds).to.contains('Breakfast');
        })
    });
});
