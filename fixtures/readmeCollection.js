// Sample data used in README
const data = [
  {
    id: 1,
    children: [
      {
        id: 10,
      },
      {
        id: 11,
        children: [
          {
            id: 110,
          },
          {
            id: 111,
            children: [
              {
                id: 1110,
              },
              {
                id: 1111,
              },
            ]
          },
          {
            id: 112,
          },
        ]
      },
      {
        id: 12,
      },
    ]
  },
  {
    id: 2,
    children: [
      {
        id: 20,
        children: [
          {
            id: 200,
          },
        ]
      },
      {
        id: 21,
      },
      {
        id: 22,
        children: [
          {
            id: 221,
          },
        ]
      },
    ]
  },
  {
    id: 3,
  },
  {
    id: 4,
    children: [
      {
        id: 40,
        children: [
          {
            id: 400,
          },
          {
            id: 401,
            children: [
              {
                id: 4010,
              },
            ]
          },
        ]
      },
      {
        id: 41,
      },
      {
        id: 42,
      },
    ]
  },
]

export default data
