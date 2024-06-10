const modal = document.getElementById("modal")
const amountOfQuestions = document.getElementById("amountOfQuestions")
const category = document.getElementById("category")
const difficulty = document.getElementById("difficulty")
const type = document.getElementById("type")
const modalSubmit = document.getElementById("modalSubmit")
const main = document.getElementById("mainQuestionContainer")
const question = document.getElementById("question")
const answer1 = document.getElementById("answer1")
const answer2 = document.getElementById("answer2")
const answer3 = document.getElementById("answer3")
const answer4 = document.getElementById("answer4")

let globalData = {}
let questionCounter = 0
let score = 0

const assingQuestionsMultiple = () => {
    const correctAnswer = globalData.results[questionCounter].correct_answer
    const incorrectAnswers = globalData.results[questionCounter].incorrect_answers
    const answers = [...incorrectAnswers, correctAnswer]

    const shuffledAnswers = shuffleArray(answers)

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`answer${i}`).textContent = shuffledAnswers[i - 1]
    }

    console.log(`answer${shuffledAnswers.indexOf(correctAnswer) + 1}`)
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

const getData = async (amount, difficulty, category, type) => {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`)
    const data = await response.json()
    return data
}

amountOfQuestions.addEventListener("keyup", () => {
    if (amountOfQuestions.value > 50) {
        amountOfQuestions.value = 50
    } else if (amountOfQuestions.value < 0) {
        amountOfQuestions.value = 0
    }
})

modalSubmit.addEventListener("click", async (e) => {
    if (!amountOfQuestions.value) {
        alert("Enter amount of questions")
    } else {
        globalData = await getData(Number(amountOfQuestions.value), difficulty.value, Number(category.value), type.value)
        modal.classList.remove("modalVisible")
        modal.classList.add("modalHidden")
        main.classList.remove("mainHidden")
        main.classList.add("mainVisible")
        console.log(globalData)

        question.textContent = globalData.results[questionCounter].question

        assingQuestionsMultiple()
    }
})

const handleAnswerClick = (selectedAnswer) => {
    const correctAnswer = globalData.results[questionCounter].correct_answer
    
    if (correctAnswer === selectedAnswer.textContent) {
        score++
    }

    modal.classList.remove("modalHidden")
    modal.classList.add("modalVisible")
    modal.innerHTML = `<modal class="modalVisible" id="modal">
        <p style="font-size: 50px">${correctAnswer === selectedAnswer.textContent ? 'NICE' : ':(</p>'}
    </modal>`
    setTimeout(() => {
        modal.classList.remove("modalVisible")
        modal.classList.add("modalHidden")


        if (questionCounter == globalData.results.length - 1) {
            main.innerHTML = `<main id="mainQuestionContainer" class="mainVisible">
            <div>
                <p>Your score: ${score}/${globalData.results.length}</p>
            </div>
        </main>`
        } else {
            questionCounter++

            question.textContent = globalData.results[questionCounter].question
            assingQuestionsMultiple()
        }
    }, 1000)
}

answer1.addEventListener("click", () => handleAnswerClick(answer1))
answer2.addEventListener("click", () => handleAnswerClick(answer2))
answer3.addEventListener("click", () => handleAnswerClick(answer3))
answer4.addEventListener("click", () => handleAnswerClick(answer4))
