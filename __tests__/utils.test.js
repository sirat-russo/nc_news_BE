const {
  convertTimestampToDate, createArticleRef, makeCommentsWithArticleId
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createArticleRef", () => {
  test("returns empty object for empty array", () => {
    expect(createArticleRef([])).toEqual({});
  });

  test("maps single row: title -> article_id", () => {
    const rows = [{ article_id: 7, title: "Hello World" }];
    expect(createArticleRef(rows)).toEqual({ "Hello World": 7 });
  });

  test("maps multiple rows and does not mutate input", () => {
    const rows = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
    ];
    const snapshot = JSON.parse(JSON.stringify(rows));
    const ref = createArticleRef(rows);
    expect(ref).toEqual({ A: 1, B: 2 });
    expect(rows).toEqual(snapshot);
  });
});

describe("makeCommentsWithArticleId", () => {
  const articleRows = [
    { article_id: 10, title: "Cats" },
    { article_id: 20, title: "Dogs" },
  ];
  const articleRef = createArticleRef(articleRows);

  test("handles empty comments array", () => {
    expect(makeCommentsWithArticleId([], articleRef)).toEqual([]);
  });
  
  test("converts article_title to article_id and unix created_at to Date", () => {
    const unix = 1609459200000; 
    const input = [
      {
        article_title: "Cats",
        body: "Nice post",
        votes: 3,
        author: "butter_bridge",
        created_at: unix,
      },
    ];

    const output = makeCommentsWithArticleId(input, articleRef);
    expect(output).toHaveLength(1);

    const [comment] = output;
    expect(comment).toMatchObject({
      article_id: 10,
      body: "Nice post",
      votes: 3,
      author: "butter_bridge",
    });
    expect(comment.created_at instanceof Date).toBe(true);
  });

  test("does not mutate original array or objects", () => {
    const unix = 1609459200000;
    const input = [
      {
        article_title: "Dogs",
        body: "Woof",
        votes: -1,
        author: "icellusedkars",
        created_at: unix,
      },
    ];
    const snapshot = JSON.parse(JSON.stringify(input));

    const output = makeCommentsWithArticleId(input, articleRef);

    expect(input).toEqual(snapshot);
    expect(output).not.toBe(input);
    expect(output[0]).not.toBe(input[0]);
  });

});

