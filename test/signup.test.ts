import axios from "axios";

axios.defaults.validateStatus = () => true;

let inputSignup: any;
let outputSignup: any;

beforeEach(async () => {
    // given (Dê)
    inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
});

describe("Caso positivo: criação de conta", () => {
    test("Deve definir uma conta", async () => {
        // when (Quando)
        const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
        outputSignup = responseSignup.data;

        // Then (Então)
        expect(outputSignup.accountId).toBeDefined();
    })

    test("Deve criar uma conta válida", async () => {
        // When (Quando)
        const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
        const outputGetAccount = responseGetAccount.data;

        // Then (Então)
        expect(outputGetAccount.name).toBe(inputSignup.name);
        expect(outputGetAccount.email).toBe(inputSignup.email);
        expect(outputGetAccount.document).toBe(inputSignup.document);
    });
});

describe("Caso negativo: criação de conta", () => {
    test("Não deve criar uma conta com nome inválido", async () => {
        inputSignup.name = "John";
        const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
        const outputSignup = responseSignup.data;

        expect(responseSignup.status).toBe(422);
        expect(outputSignup.error).toBe("Invalid name");
    });

    test("Não deve criar uma conta com email inválido", async () => {
        inputSignup.email = "john.doe";
        const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
        const outputSignup = responseSignup.data;

        expect(responseSignup.status).toBe(422);
        expect(outputSignup.error).toBe("Invalid email");
    });

    test.each([
        "111",
        "abc",
        "7897897897"
    ])("Não deve criar uma conta com cpf inválido", async (document: string) => {
        inputSignup.document = document;
        const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
        const outputSignup = responseSignup.data;
        
        expect(responseSignup.status).toBe(422);
        expect(outputSignup.error).toBe("Invalid document");
    });

    test("Não deve criar uma conta com senha inválida", async () => {
        inputSignup.password = "asdQWE";
        const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
        const outputSignup = responseSignup.data;

        expect(responseSignup.status).toBe(422);
        expect(outputSignup.error).toBe("Invalid password");
    });
});