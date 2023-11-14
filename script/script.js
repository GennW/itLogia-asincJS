let a = 1; // call stack

setTimeout(() => { // webAPIs асинхронная добавляется event Queue
  a = 2;
}, 1000); // добавится в очередь через 1с и выполнится после освобождения stack

console.log(a); // 1 синхроная выполняется первее



/////////////////////////////////////////////////////////////


// пример неправильного кода с callback
$.ajax({
  dataType: 'json',
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  success: (result) => {
    console.log(result);
    // 1 начало делаем запрос callback использовать результат каждого запроса в следующем
    $.ajax({
      dataType: 'json',
      url: 'https://jsonplaceholder.typicode.com/todos/' + (result.id + 1),
      success: (result) => {
        console.log(result);
        // 2 начало делаем запрос callback использовать результат каждого запроса в следующем
        $.ajax({
          dataType: 'json',
          url: 'https://jsonplaceholder.typicode.com/todos/' + (result.id + 1),
          success: (result) => {
            console.log(result);
          }
        })
        // 2 конец делаем запрос callback использовать результат каждого запроса в следующем
      }
    })
    // 1 конец делаем запрос callback использовать результат каждого запроса в следующем
  }
})

console.log(2);





// пример кода с promise


fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then((json) => {
    console.log(json);
    return fetch('https://jsonplaceholder.typicode.com/todos/' + (json.id + 1))
  })
  .then(response => response.json())
  .then((json) => {
    console.log(json);
    return fetch('https://jsonplaceholder.typicode.com/todos/' + (json.id + 1))
  })
  .then(response => response.json())
  .then((json) => {
    console.log(json);
  })
  .catch(error => console.log(error)) // отловит любую ошибку выше



// создание промиса
function getSomeData(param) {
  return new Promise((resolve, reject) => {
    if (param === 1) {
      resolve('Это один!');
    } else {
      reject('Это не один :(')
    }
  })
}
getSomeData(2)
  .then(string => console.log(string))
  .catch(error => console.log(error)); // Это не один :(

// создание промиса
function getJsonData(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject('Запрос осуществить невозможно')
    }
    $.ajax({
      dataType: 'json',
      url: url,
      success: (result) => {
        resolve(result);
      },
      error: () => {
        reject('Ошибка запроса');
      }
    })

  })
}

// асинхронное выполнение кода
getJsonData('https://jsonplaceholder.typicode.com/todos/1')
  .then(json => {
    console.log(json)//{userId: 1, id: 1, title: 'delectus aut autem', completed: false}
    return getJsonData('https://jsonplaceholder.typicode.com/todos/' + (json.id + 1))
  })
  .then(json => {
    console.log(json) //{userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed: false}
    return getJsonData('https://jsonplaceholder.typicode.com/todos/' + (json.id + 1))
  })
  .then(json => {
    console.log(json)//{userId: 1, id: 3, title: 'fugiat veniam minus', completed: false}
  });

//Выполнение нескольких промисов параллельно
Promise.all([
  getJsonData('https://jsonplaceholder.typicode.com/todos/1'),
  getJsonData('https://jsonplaceholder.typicode.com/todos/2'),
  getJsonData('https://jsonplaceholder.typicode.com/todos/3'),
])

  .then(json => console.log(json)); // массив (3) [{…}, {…}, {…}]

// синхронное выполнение кода внутри асинхронной функции
async function start() {
  const json = await getJsonData('https://jsonplaceholder.typicode.com/todos/1');
  console.log('синхронное выполнение кода внутри асинхронной функции', json);

  const json2 = await getJsonData('https://jsonplaceholder.typicode.com/todos/' + (json.id + 1));
  console.log('синхронное выполнение кода внутри асинхронной функции', json2);

  const json3 = await getJsonData('https://jsonplaceholder.typicode.com/todos/' + (json2.id + 1));
  console.log('синхронное выполнение кода внутри асинхронной функции', json3);
};

start();






// примеры
var z = 5;
setTimeout(function timeout() {
  console.log('внутри', z);
  z = 10;
}, 3000);
console.log(z);
/* 
Когда вы вызываете setTimeout, он планирует выполнение функции 
timeout() спустя указанное количество миллисекунд 
(в данном случае 3000 мс). Однако код продолжает выполняться 
без ожидания завершения отложенной функции timeout(). 
Таким образом, при первом вызове console.log(z) будет выведено
 текущее значение z, которое равно 5.

После прошествия 3 секунд, функция timeout() будет вызвана, 
и в ней значение переменной z изменится на 10. Однако, вывод 
внутри timeout() снова выведет значение, которое было в момент 
вызова функции setTimeout, а именно 5, так как внутри 
timeout() в тот момент значение уже было скопировано и 
сохранено в замыкании.

Таким образом, в результате выполнения этого кода сначала 
будет выведено значение 5, а через 3 секунды внутри timeout() 
также будет выведено значение 5.


 В момент выполнения console.log('внутри', z); внутри функции 
 timeout(), переменная z уже была изменена на 10. Однако, 
 из-за особенностей работы синхронного и асинхронного кода в 
 JavaScript, значение z внутри console.log('внутри', z); 
 остается 5 из-за того, что вложенная функция имеет доступ 
 только к переменным, объявленным во внешней области видимости 
 на момент ее создания.
*/




function delay(sec) {
  return new Promise((resolve, reject) => {
    if (!sec) {
      reject('Не указан параметр в секундах')
    } else {
      setTimeout(resolve, sec * 1000);
    }
  })
}
delay(2).then(() => console.log('Прошло 2 секунды'));
delay(5).then(() => console.log('Прошло 5 секунд'));
delay().then(() => console.log('Прошло 5 секунд')); //Uncaught (in promise) Не указан параметр в секундах

//Этот код создает промис, который приостанавливает свое 
//выполнение на переданное количество секунд, после чего 
//выполняет переданную в качестве параметра колбэк-функцию 
//с помощью метода then().



Promise
  .resolve('a')
  .then((x) => {
    console.log(x);
    return 'b'
  })
  .then((x) => {
    console.log(x);
    return 'c'
  })
  .then((x) => console.log(x));

/*Конструкция Promise.resolve('a') создает новый промис, который 
немедленно выполняется и возвращает значение 'a'. 
Затем метод .then() применяет функцию обратного вызова, 
которая выводит 'a' в консоль и возвращает значение 'b'.
Следующий метод .then() принимает значение 'b' от предыдущего 
обработчика, выводит его в консоль, затем возвращает значение 'c'.
Наконец, последний метод .then() принимает значение 'c', выводит 
его в консоль, и так как больше обработчиков нет, операция 
завершается.
По итогу выполнения этого кода в консоль будут выведены 
значения 'a', 'b' и 'c' в указанном порядке.
*/