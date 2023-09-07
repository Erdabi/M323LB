// Das sind die verschiedenen Aktionen die in der App auftreten können.
const MSG = {
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_ANSWER: "UPDATE_ANSWER",
  SAVE_CARD: "SAVE_CARD",
  HIDE_ANSWER: "HIDE_ANSWER",
  DELETE_CARD: "DELETE_CARD",
  EDIT_CARD: "EDIT_CARD",
  RATE_CARD: "RATE_CARD",
};
//du nigger
import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";


const { div, button, input, p, br } = hh(h); //hilfestruckturen



// 'dispatch' sendet die Aktionen an andere Teile der App.
// 'model' hat die aktuellen Daten der App.
function view(dispatch, model) {
  return div({ class: "p-4" }, [
    div([
      input({
        type: "text",
        placeholder: "Frage eingeben",
        value: model.question,
        oninput: (event) =>
          dispatch({
            type: MSG.UPDATE_QUESTION,
            value: event.target.value,
          }),
        class: "mr-10",
      }),
      input({
        type: "text",
        placeholder: "Antwort eingeben",
        value: model.answer,
        oninput: (event) =>
          dispatch({ type: MSG.UPDATE_ANSWER, value: event.target.value }),
        class: "mr-10",
      }),
      button(
        {
          onclick: () => dispatch({ type: MSG.SAVE_CARD }),
          class: "px-2 py-1",
        },
        "➕"
      ),
    ]),
    ...model.cards.map((card, index) => div(
        { key: index, class: "w-60 m-10 p-10"},[
          p({ class: "top-5 right-5"},[
              button(
                {
                  onclick: () => dispatch({ type: MSG.EDIT_CARD, index }),
                },
                "✍️"
              ),
              
              button(
                {
                  onclick: () =>
                    dispatch({ type: MSG.DELETE_CARD, index }),
                  class: "text-red-500",
                },
                "🚮"
              ),
            ]
          ),
          p({}, "Frage"),
          p({}, card.question),
          br({}),
          button(
            {
              onclick: () => dispatch({ type: MSG.HIDE_ANSWER, index }),
            },
            card.showAnswer ? "Antwort verbergen" : "Antwort anzeigen"
          ),
          card.showAnswer ? p({}, card.answer) : null,
          card.showAnswer ? br({}) : null,
          div({}, [
            "Bewertung: ",
            button(
              {
                onclick: () =>
                  dispatch({ type: MSG.RATE_CARD, index, rating: 0 }),
              },
              "👎"
            ),
            button(
              {
                onclick: () =>
                  dispatch({ type: MSG.RATE_CARD, index, rating: 1 }),
              },
              "👍"
            ),
            button( 
              {
                onclick: () =>
                  dispatch({ type: MSG.RATE_CARD, index, rating: 2 }),
              },
              "👌"
            ),
          ]),
        ]
      )
    ),
  ]);
}

// 'message' ist die Nachricht, die sagt, welche Aktion passiert ist.
// 'model' enthält die aktuellen Daten der App.
function update(message, model) {
  switch (message.type) {
    case MSG.UPDATE_QUESTION:
      return { ...model, question: message.value };

    case MSG.UPDATE_ANSWER:
      return { ...model, answer: message.value };

    case MSG.SAVE_CARD:
      return {
        ...model,

        cards: [
          ...model.cards,
          {
            question: model.question,
            answer: model.answer,
            showAnswer: false,
            rating: 0,
          },
        ],
        question: "",
        answer: "",
      };

    case MSG.HIDE_ANSWER:
      const updatedCards = [...model.cards];
// Die 'showAnswer' (true wird zu false und umgekehrt).
      updatedCards[message.index].showAnswer =
        !updatedCards[message.index].showAnswer;

      return { ...model, cards: updatedCards };

    case MSG.DELETE_CARD:
      return {
        ...model,
        cards: model.cards.filter((_, index) => index !== message.index),
      };

    case MSG.EDIT_CARD:
      const cardToEdit = model.cards[message.index];

      return {
        ...model,

        question: cardToEdit.question,
        answer: cardToEdit.answer,
        cards: model.cards.filter((_, index) => index !== message.index),
      };

    case MSG.RATE_CARD:
     
    default:
      return model;
  }
}

const initModel = {
  question: "",
  answer: "",
  cards: [],
};

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);