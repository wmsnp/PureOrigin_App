'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "965394c42e36c0ea9893e1a4ec3682ff",
"assets/AssetManifest.bin.json": "ee9844456c3a92315413128e59dab623",
"assets/AssetManifest.json": "7c4b13979b4998d935c6a212160ae247",
"assets/assets/fonts/NotoSansSC-Regular.ttf": "0a35002af18c39740c08a97188247175",
"assets/assets/fonts/Roboto-Bold.ttf": "b8e42971dec8d49207a8c8e2b919a6ac",
"assets/assets/fonts/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/assets/images/gourd_1.jpg": "496943e065badea0d6844a89b8b9fe25",
"assets/assets/images/human.jpg": "949df4fe5b7f69453aba461ec1cf9889",
"assets/assets/images/lotus_1.jpg": "10bc5b8e460eb9bc5b1a63b1b19b433b",
"assets/FontManifest.json": "bd63cf9a1c1068ecee3fc15acd27bae4",
"assets/fonts/MaterialIcons-Regular.otf": "46dc75e1e20aba0c28f86be6e6e4fe5f",
"assets/fonts/NotoSansSC-Regular.ttf": "0a35002af18c39740c08a97188247175",
"assets/fonts/Roboto-Bold.ttf": "b8e42971dec8d49207a8c8e2b919a6ac",
"assets/fonts/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/NOTICES": "5896ba91e38936dd43e942bd6e96d626",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_AMS-Regular.ttf": "657a5353a553777e270827bd1630e467",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Bold.ttf": "a9c8e437146ef63fcd6fae7cf65ca859",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Regular.ttf": "7ec92adfa4fe03eb8e9bfb60813df1fa",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Bold.ttf": "46b41c4de7a936d099575185a94855c4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Regular.ttf": "dede6f2c7dad4402fa205644391b3a94",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Bold.ttf": "9eef86c1f9efa78ab93d41a0551948f7",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-BoldItalic.ttf": "e3c361ea8d1c215805439ce0941a1c8d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Italic.ttf": "ac3b1882325add4f148f05db8cafd401",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Regular.ttf": "5a5766c715ee765aa1398997643f1589",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-BoldItalic.ttf": "946a26954ab7fbd7ea78df07795a6cbc",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-Italic.ttf": "a7732ecb5840a15be39e1eda377bc21d",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Bold.ttf": "ad0a28f28f736cf4c121bcb0e719b88a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Italic.ttf": "d89b80e7bdd57d238eeaa80ed9a1013a",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Regular.ttf": "b5f967ed9e4933f1c3165a12fe3436df",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Script-Regular.ttf": "55d2dcd4778875a53ff09320a85a5296",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size1-Regular.ttf": "1e6a3368d660edc3a2fbbe72edfeaa85",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size2-Regular.ttf": "959972785387fe35f7d47dbfb0385bc4",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size3-Regular.ttf": "e87212c26bb86c21eb028aba2ac53ec3",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size4-Regular.ttf": "85554307b465da7eb785fd3ce52ad282",
"assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Typewriter-Regular.ttf": "87f56927f1ba726ce0591955c8b3b42d",
"assets/packages/gpt_markdown/lib/fonts/JetBrainsMono-Regular.ttf": "d09f65145228b709a10fa0a06d522d89",
"assets/packages/window_manager/images/ic_chrome_close.png": "75f4b8ab3608a05461a31fc18d6b47c2",
"assets/packages/window_manager/images/ic_chrome_maximize.png": "af7499d7657c8b69d23b85156b60298c",
"assets/packages/window_manager/images/ic_chrome_minimize.png": "4282cd84cb36edf2efb950ad9269ca62",
"assets/packages/window_manager/images/ic_chrome_unmaximize.png": "4a90c1909cb74e8f0d35794e2f61d8bf",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "86e461cf471c1640fd2b461ece4589df",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/chromium/canvaskit.js": "34beda9f39eb7d992d46125ca868dc61",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"flutter_bootstrap.js": "71f44c02dc59c7f8917723382a6ded54",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "5eef1560e8f7323841f41331ebd9bae7",
"/": "5eef1560e8f7323841f41331ebd9bae7",
"main.dart.js": "d232d8fe26239054db048e18d549e716",
"main.dart.js_1.part.js": "c747f3e5dbe430c490c72256e55900f2",
"main.dart.js_10.part.js": "4d9c3116f379a3f6cc53368b92d88288",
"main.dart.js_100.part.js": "1f38a62a22ac807ac5425c20d54c7858",
"main.dart.js_101.part.js": "0bdf9fb18c102fc2608050ecb9942717",
"main.dart.js_102.part.js": "bd7329b09115e6b7edeaba6d409da647",
"main.dart.js_103.part.js": "32c4d43b82b61ae637b9a14bb7289039",
"main.dart.js_104.part.js": "7a0bade7bf02a7aaa2e8770fb203040e",
"main.dart.js_105.part.js": "6ffcf18bf7c2da2546e8fdd0f7ee2d9e",
"main.dart.js_106.part.js": "526561f23b90729dc8c8eda57c3b41c0",
"main.dart.js_107.part.js": "f7b3266e2e4cdb5e28e0d528944a365e",
"main.dart.js_108.part.js": "8b7d7b141d0275230b00f61973c934ec",
"main.dart.js_109.part.js": "98c617ce6660b4547de6ea6eab1d592a",
"main.dart.js_11.part.js": "9f25fcae3e6791c42d11dbed326e5647",
"main.dart.js_110.part.js": "3b17c19fcbef58fbc65a0b6f3281be9e",
"main.dart.js_111.part.js": "cd523387b2e8818f7801cc452deead98",
"main.dart.js_112.part.js": "05e1b6668edf5f401cbd3db471a2929c",
"main.dart.js_113.part.js": "65aa2345737c0d70e55369a646fe8b6c",
"main.dart.js_114.part.js": "3cfa20c87623d385c6a1671eb7563d67",
"main.dart.js_115.part.js": "b2091652e5a2d6262a0276a1bbec5ca4",
"main.dart.js_116.part.js": "0d348a3c78f2faa2e78ccedb9eb284b1",
"main.dart.js_117.part.js": "53d7ddb9d3744da64f736b03e7573552",
"main.dart.js_118.part.js": "3922cf43a2b537bf3037626449b7cdfc",
"main.dart.js_119.part.js": "1f0ac7a8822c21263be21e9d1440a8a4",
"main.dart.js_12.part.js": "8b9c88b7fb191ade32944166580d2298",
"main.dart.js_120.part.js": "b16adfbfbf491cc8cd025e55651fc3cb",
"main.dart.js_121.part.js": "9d24c9e73e948b29cfbdb19438bd38c0",
"main.dart.js_122.part.js": "e27519ae23bd0c84b5dc0c5f63f0f1c3",
"main.dart.js_123.part.js": "425a16b3f4d741ab5ae6da339ed80d37",
"main.dart.js_124.part.js": "03556e4604877d56f0425081c032ad2a",
"main.dart.js_125.part.js": "0615123039d888a86d25bf37c79d66fa",
"main.dart.js_126.part.js": "df23800e0b345ed7cda35edf688708c6",
"main.dart.js_127.part.js": "6d4f8c13b24e3bea9a9fb770ccd75a3b",
"main.dart.js_128.part.js": "7567b9c15d9ff555a88681eb5873bb25",
"main.dart.js_129.part.js": "ec6069dc42dc4760161b3eeb56a2f8f0",
"main.dart.js_13.part.js": "d58deb46af6bc89d209248d1c0721a90",
"main.dart.js_130.part.js": "d306e2936b01a4d2631c9df7935a256d",
"main.dart.js_131.part.js": "4226a17ea260783379f1dc8d8215ae4e",
"main.dart.js_132.part.js": "0ea2c87f10fc86c4ac0457181321e402",
"main.dart.js_133.part.js": "8850e2e694872dbb41e3ceb62dcf6364",
"main.dart.js_134.part.js": "06ca4aed0c32d253ad5ce0803fe7a488",
"main.dart.js_135.part.js": "6d8bb26b5124d5f27c152a2450d3b541",
"main.dart.js_136.part.js": "0e37d6e6fecdb5aeaf69f696d4ee0533",
"main.dart.js_137.part.js": "6b3e1e8e66445f98357264dbe9c56344",
"main.dart.js_138.part.js": "7ffa2088fbd4d16864a7170019492b17",
"main.dart.js_139.part.js": "831b68f12506cf1c867c76e6071e7c07",
"main.dart.js_14.part.js": "ad7e6dd0f0b61df82a943698df0c822b",
"main.dart.js_140.part.js": "4f4bb5a0afba4403054174b0e11c321b",
"main.dart.js_141.part.js": "2e1944674b957fa7d9923446eed648c5",
"main.dart.js_142.part.js": "44f9c692f8e42710701aa99b299fbcb6",
"main.dart.js_143.part.js": "9e8b067219bb019407d4ff5584bc9f90",
"main.dart.js_144.part.js": "a7d984299acbde76f91350161962c98d",
"main.dart.js_145.part.js": "d793aceec4604f0c040437f0ad75285b",
"main.dart.js_146.part.js": "989201f9db98218e7ccef8426a9b9fb3",
"main.dart.js_147.part.js": "d8cc8389de469151ab3ffe3ebd992965",
"main.dart.js_148.part.js": "240a4c8cb8c5892e8988828ee616a0ab",
"main.dart.js_149.part.js": "ee5cc4e15e9f027851543e3c4b7d84a2",
"main.dart.js_15.part.js": "cd45f9a64c8c85fc4de076aeca6cecb5",
"main.dart.js_150.part.js": "e83dd54a10058903345e28276549a3f2",
"main.dart.js_151.part.js": "b5cb07e83d7bdaa4673ad7fcd1303a2a",
"main.dart.js_152.part.js": "d203cf44925a9ca775d15466fbf9e867",
"main.dart.js_153.part.js": "c4793766d69152d1f26b8f6a7a0bf775",
"main.dart.js_154.part.js": "7b0efc0f16f91092193154dd4f07c36e",
"main.dart.js_155.part.js": "14f77ca821f60c017568ad24e068fa93",
"main.dart.js_156.part.js": "6e77bba282c402f964e6e8621690d260",
"main.dart.js_157.part.js": "c73a060ddc28d889873f487ca0480ad8",
"main.dart.js_158.part.js": "80e37b48da21fcc0accec3cac7d47e73",
"main.dart.js_159.part.js": "c50b6cdc0a5d015acad3852b67b73096",
"main.dart.js_16.part.js": "8ee5f9807771c409a9b6952b9204e26d",
"main.dart.js_160.part.js": "7a7148509278e109c8307a74edb2b242",
"main.dart.js_161.part.js": "4bea5512aefa39a68f19a20c9a67bf0a",
"main.dart.js_162.part.js": "bd09913e878d6be6cf504e2652be8266",
"main.dart.js_163.part.js": "dbc2134b1828a8966e183dc179a5600d",
"main.dart.js_164.part.js": "2af1fae6a9050d0b9788d197ebbd1fb7",
"main.dart.js_165.part.js": "07380081de98b8abb76e6f210b135814",
"main.dart.js_166.part.js": "32e591a963907e1dee0ccb63345485a7",
"main.dart.js_167.part.js": "4c4266adc5c163db04a90100f258f6a6",
"main.dart.js_168.part.js": "cb1dc650796d36141e804bc72987569d",
"main.dart.js_169.part.js": "07fa2aad1b9e380be2fd646bbdc0915c",
"main.dart.js_17.part.js": "b8feeaecd7350c6b7a8554924c90953f",
"main.dart.js_170.part.js": "f8d8f7449ea0661ce7d404262cbd9273",
"main.dart.js_171.part.js": "e7a7ab2f4b66a6b475a7606aebadbf51",
"main.dart.js_172.part.js": "11fe8893e6cf67324165ebd38223604c",
"main.dart.js_173.part.js": "2ad66a5e47e47aa1b5d19c6acf2d0dc9",
"main.dart.js_174.part.js": "676dcaf96a466c121f10dd176f5fd9a4",
"main.dart.js_175.part.js": "759294671511605b3f1d9934b6c9d78d",
"main.dart.js_176.part.js": "f6e7592290b76a97705899abe3ed4268",
"main.dart.js_177.part.js": "be642a1377e64b107fc1616acf4dff2a",
"main.dart.js_178.part.js": "45280bbe51c0f21308ab96eef6f3ed88",
"main.dart.js_179.part.js": "da8aa235de446e5ab6940868599afdc5",
"main.dart.js_18.part.js": "8e498a6963437c8e8ce09ebd2851fe78",
"main.dart.js_180.part.js": "4ddae553bd49c92da03b990ff8ee63f0",
"main.dart.js_181.part.js": "d0a9167239c4f1d8a3dd7face501372c",
"main.dart.js_182.part.js": "8e36ace698a53c187f760af3e92b57ca",
"main.dart.js_183.part.js": "5794970f5c5d75e5c940f587091fec1e",
"main.dart.js_184.part.js": "8e6bb6cf86f3ce84286e53803e66a917",
"main.dart.js_185.part.js": "b2f5b04c67fbc8a38b60ea9790a45da3",
"main.dart.js_186.part.js": "dff0e62f62e40fddd3f1c8919ba8b084",
"main.dart.js_187.part.js": "a8270e9ea17e92511e039e86d5caecd6",
"main.dart.js_188.part.js": "89b4d57425856d308d7b0fb1290a0da0",
"main.dart.js_189.part.js": "33c9fe3cc38ff7b3c03de87f0624fb23",
"main.dart.js_19.part.js": "0e6c20facaf32fbde2e4132c8e6b626f",
"main.dart.js_190.part.js": "730b5f6d78190623e59671afa809938f",
"main.dart.js_191.part.js": "1a958772e75f5740754fbb68502957c9",
"main.dart.js_192.part.js": "2eff66e7ca303035b829250170639ed5",
"main.dart.js_193.part.js": "bc90ac01f24a24ea9c55098120498404",
"main.dart.js_194.part.js": "ead1049dad4bb7601a7bdd1d9b976f4b",
"main.dart.js_195.part.js": "77df1c3f01034e755b0d9fb687527d1d",
"main.dart.js_196.part.js": "b456c64582e85f657aec72b2b7d02a80",
"main.dart.js_197.part.js": "778adf8631788a451880e5adf0f0327c",
"main.dart.js_198.part.js": "24b63af5604a4cd4ff27c22446917f38",
"main.dart.js_199.part.js": "c39323478fb9e81deae2b9ffa8ecebf9",
"main.dart.js_2.part.js": "217295a5e85e2ffc761d8ef5990a7c9b",
"main.dart.js_20.part.js": "b18ec47c9023e65026b499cb370b6da7",
"main.dart.js_200.part.js": "d86fdf24e28b6182fbacd2a20c999997",
"main.dart.js_201.part.js": "7b66dea5722b053aed060799c1729b01",
"main.dart.js_202.part.js": "8c694605dcf78439f73e48a8d44ecc6f",
"main.dart.js_203.part.js": "1be4d76819bfc427d0a41aa981b4bcbc",
"main.dart.js_204.part.js": "2dd416ea491effd50dcffdadd0ee6c0d",
"main.dart.js_205.part.js": "13d659b3d5f0b6302dd35d5a62ea58a1",
"main.dart.js_206.part.js": "2d1b7293b2fb039cb27f426ec0fc0a04",
"main.dart.js_207.part.js": "abd18c17b6f9445fbf4d8cbb97f36bfe",
"main.dart.js_208.part.js": "8c169006e4d271bec6ea2cb33f39ac6b",
"main.dart.js_209.part.js": "9cc67ff8e2d0fc4eeb3f1a1f3b6fe6f2",
"main.dart.js_21.part.js": "dea60589e3d21b486b4e278007d144a1",
"main.dart.js_210.part.js": "81e67908415f3c38a0554c958332ecea",
"main.dart.js_211.part.js": "762676af29258180cf50455c0b4f3d55",
"main.dart.js_212.part.js": "6d89a1b69aa44ba2aa8592e50ef4e298",
"main.dart.js_214.part.js": "5de77dd654482210095cc4b9730da901",
"main.dart.js_215.part.js": "7d4a24fa1df319b4b90d8d7bd5109e7d",
"main.dart.js_216.part.js": "fca092d29f663c77f1c8074f152e30c8",
"main.dart.js_218.part.js": "832e7c10b740132903fdce79236cdd2a",
"main.dart.js_219.part.js": "fcb0375ef6abf1db7d8564d74a79d313",
"main.dart.js_22.part.js": "9c043257dfca0b29349da0fc8361565b",
"main.dart.js_220.part.js": "7d213ed93ed241970293e98301e5cb0c",
"main.dart.js_221.part.js": "cfa042bab188248045ab851aacbf7e56",
"main.dart.js_222.part.js": "43f0db35bd3a5d20c5eb0251bd0c863e",
"main.dart.js_223.part.js": "12eacb3312d12b9d01f28db43b784a1e",
"main.dart.js_224.part.js": "fc76787b8d00b4e90af807f609dd954d",
"main.dart.js_23.part.js": "ebd10560664f99a652160c411536be89",
"main.dart.js_24.part.js": "5a556334e67fc677175171bc2561ae2b",
"main.dart.js_25.part.js": "0bebe0cb871cc1b77860cc80177f1599",
"main.dart.js_26.part.js": "bd98acc4b596a4177d8a9c127c542915",
"main.dart.js_27.part.js": "c7bec7993c28bf37ada8db99acb8bf5d",
"main.dart.js_28.part.js": "456cf3010a698cb500a68ff3273aa48d",
"main.dart.js_29.part.js": "c7dd61dabb8662219fc622638720d99a",
"main.dart.js_3.part.js": "dfa1d39c3eaf991e42f5e36d40acb464",
"main.dart.js_30.part.js": "ed9a2221e09f3347160340e51772b218",
"main.dart.js_31.part.js": "10cdba2a51394f14fac462f6a8eff6ea",
"main.dart.js_32.part.js": "0e27058ad04bc9f51e1cd1e1f98868ca",
"main.dart.js_33.part.js": "a601ed590eb3da7f2a0dc344bea6f934",
"main.dart.js_34.part.js": "6f5298475b5c625ed69f345de921f966",
"main.dart.js_35.part.js": "2c81d550084deff2dc2f6001d310dbb2",
"main.dart.js_36.part.js": "d60454dc02dc934719e4e9db86da7a0b",
"main.dart.js_37.part.js": "f6ed09d9775c1c74bbee057f6aa51160",
"main.dart.js_38.part.js": "2d7b7cebcd671695ae13cb252acd5d8b",
"main.dart.js_39.part.js": "025d7b8fd9a2d43825c19c6a4d05bace",
"main.dart.js_4.part.js": "8ff930978a32f8f08de16905e88c5b19",
"main.dart.js_40.part.js": "d2e38174ce8c2651397ab5a185ce2cac",
"main.dart.js_41.part.js": "76245e03f06a90d4853e6581204faddb",
"main.dart.js_42.part.js": "565db98f7e5899e4d8748a184a05fc8d",
"main.dart.js_43.part.js": "fe103dbe31d273cc147320661a508de9",
"main.dart.js_44.part.js": "37e948d53583217d2fe3ba952b602232",
"main.dart.js_45.part.js": "a40a791a12f71b0833a0ef36baf03b82",
"main.dart.js_46.part.js": "2baaf41a9af0adac9a3cad83dc720431",
"main.dart.js_47.part.js": "2f295ee0113e4c991f00d67dddef63a8",
"main.dart.js_48.part.js": "a85c372f1cae9be7df40a9b6086e8b86",
"main.dart.js_49.part.js": "3d4d5ba04eb1899dfd05a08caa89b084",
"main.dart.js_5.part.js": "9337f86c37437b734a9afbab9b980377",
"main.dart.js_50.part.js": "6c5bfc6cd4434fc1b5334f7586a34904",
"main.dart.js_51.part.js": "376a6d8825c503427790a1b012b70f4a",
"main.dart.js_52.part.js": "590b11a77229e446164342a67fb98c1a",
"main.dart.js_53.part.js": "45380713509acdf96994b1ebb276f6fc",
"main.dart.js_54.part.js": "b6d47f1026d7ddd896f950792dcb6553",
"main.dart.js_55.part.js": "364a74eaf71cf499a1a11666b2a9c9cc",
"main.dart.js_56.part.js": "ed509a56e9e0ea6f57b4e47b22f7b4b0",
"main.dart.js_57.part.js": "5edce7dc3b2ede2ca189a3f474dd52c7",
"main.dart.js_58.part.js": "424cb022f0f6fc3c8ed769379d8bbda3",
"main.dart.js_59.part.js": "4c55cf0f042765dba05695d5edf8be27",
"main.dart.js_6.part.js": "846a521c7c790e22affe7476dbab64a1",
"main.dart.js_60.part.js": "ebfb079bf01c3fd1c13655734e5cff93",
"main.dart.js_61.part.js": "293765a1bb472cad7d4c32d773c9f870",
"main.dart.js_62.part.js": "e7ab20bc38e207efbded362d538af8c2",
"main.dart.js_63.part.js": "20bd92fe4e00fc4a04d4843dbd672bc7",
"main.dart.js_64.part.js": "514831cd8eb7a01fef14adb123b512c4",
"main.dart.js_65.part.js": "ba474cc89c42988ddc7fedfd6c7afbe4",
"main.dart.js_66.part.js": "7ca4a13fbf322ffe79ac4077e5d569fa",
"main.dart.js_67.part.js": "c757163d5818ed065f7d506b272fea84",
"main.dart.js_68.part.js": "03c2d4a2dc5ad1c20d4f6425bb6b67e2",
"main.dart.js_69.part.js": "30e0d1e0ede300e1d43a0c91fde9cc2a",
"main.dart.js_7.part.js": "3f080a2cf9ad35851963ac5cfdb21e16",
"main.dart.js_70.part.js": "e56e17e42abe626ecbd12449f34f6aaf",
"main.dart.js_71.part.js": "e4dcf7871bb205a7e1823f5da3a1e04d",
"main.dart.js_72.part.js": "3542df9e0155c6fe38ebba3e5cfd4bad",
"main.dart.js_73.part.js": "bebe528a8e23b434284daa0bacbd5f55",
"main.dart.js_74.part.js": "a6812f54a364cbfaa25623d9a3f875b5",
"main.dart.js_75.part.js": "fee3e8dce9ef5ed402d5343901fb7942",
"main.dart.js_76.part.js": "36af8e87158126ce295671d201d951d4",
"main.dart.js_77.part.js": "ba3abb9fb246292a88b40fdcfcca8793",
"main.dart.js_78.part.js": "943e64aba21d0839c3dd823929bb25cf",
"main.dart.js_79.part.js": "3f58e3927f175cdafa490e05138c12df",
"main.dart.js_8.part.js": "86f7b09bb57efc386d4102415eb5a102",
"main.dart.js_80.part.js": "644c6900b49942d279db377218cc1ed0",
"main.dart.js_81.part.js": "42dc1022ecf9c0a99a8abad195c18bce",
"main.dart.js_82.part.js": "7e03fd63f31f8154613b8940fc1019c5",
"main.dart.js_83.part.js": "e3cc7589e0ee7f76781e98272eef8c3e",
"main.dart.js_84.part.js": "82107bff4eccc3557f3b49075c940b2a",
"main.dart.js_85.part.js": "ac4794d5b1d5c36eb71ddd48108fb497",
"main.dart.js_86.part.js": "a7875492766cdcf1e118473bc9701c7d",
"main.dart.js_87.part.js": "bf35077232126aa9114f79b85967cc1e",
"main.dart.js_88.part.js": "ac935f38e94c113a7185d560f1c3e9c2",
"main.dart.js_89.part.js": "2e02956015b37ed26caadd86a56f8ca1",
"main.dart.js_9.part.js": "319ff3f94ec6824ba132e2b168caed91",
"main.dart.js_90.part.js": "a0476e0e40749e6bbafd95cf9de2abd7",
"main.dart.js_91.part.js": "b1ecfb94cf2ca9c725772e94a5d1140e",
"main.dart.js_92.part.js": "ac5097af6028b6d010f387b5acb39700",
"main.dart.js_93.part.js": "4cdb97190edc0472ec8a7905cafecc56",
"main.dart.js_94.part.js": "47539eb660c31e1be9dcd5a9d8b6047b",
"main.dart.js_95.part.js": "e7c83f5c46640d68de26ba2177b655e5",
"main.dart.js_96.part.js": "53669220390fb2d819016dc114027df7",
"main.dart.js_97.part.js": "a898923829659d7bed44e588fe7e8c05",
"main.dart.js_98.part.js": "d63dd51230dc1b4d4018f4c5d09098d6",
"main.dart.js_99.part.js": "71fe3f6d12c9358f9ccdd3dc585035a9",
"manifest.json": "f2cb8022eba492e7381209edb0dd9d67",
"minitex.min.js": "d4794e739d7553eefc1939cabc148a81",
"pkg/package.json": "e493344961b974b587e322f965dd2230",
"pkg/rust_lib_app.js": "342338d89d8cbf71661c9196dca7fd0c",
"pkg/rust_lib_app_bg.wasm": "859acff4cf3aad50874ff1b014daf04c",
"version.json": "d1cda66bded100992ef44f142ebfabda"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
