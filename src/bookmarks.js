// One place to manage every bookmark/tool shown on the home page.
// - `type: 'internal'` items open one of the built-in tools (matched by `view`
//   in App.jsx, e.g. the NESCO checker pages).
// - `type: 'external'` items are plain links that open in a new tab — add as
//   many groups/items here as you like, no code changes needed elsewhere.
export const bookmarkGroups = [
  {
    title: 'ইউটিলিটি বিল',
    items: [
      {
        type: 'internal',
        view: 'prepaid',
        label: 'নেসকো প্রিপেইড',
        description: 'ব্যালেন্স ও রিচার্জ হিস্টোরি দেখুন',
        accent: 'purple',
      },
      {
        type: 'internal',
        view: 'postpaid',
        label: 'নেসকো পোস্টপেইড',
        description: 'মাসিক বিলের হিসাব দেখুন',
        accent: 'red',
      },
    ],
  },
  {
    title: 'দরকারি লিংক',
    items: [
      {
        type: 'external',
        url: 'https://likhon.com.bd',
        label: 'likhon.com.bd',
        description: 'উদাহরণ — এখানে আপনার নিজের লিংক যোগ করুন',
        accent: 'purple',
      },
    ],
  },
  {
    title: 'বিক্রয় রসিদ',
    items: [
      {
        type: 'internal',
        view: 'invoice',
        label: 'ক্যাশ মেমো / Invoice',
        description: 'পণ্য বিক্রির রসিদ বানিয়ে প্রিন্ট করুন',
        accent: 'purple',
      },
    ],
  },
]
