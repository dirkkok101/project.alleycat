# Asset manifest — Alley Cat (cute remake)

Game logical resolution: 1280x720. All sprites: true-alpha RGBA PNG, tight crop + ~4% padding,
side-view sprites face RIGHT, no cast shadows, no text. Style contract: `ref/STYLE.md`;
identity/style reference: `ref/cat_ref.png` (edit-chain recurring characters from their base).
"Size" = target longest side in px of the final PNG (downscale with LANCZOS).

## Batch A — hero cat poses (base: ref/cat_ref.png, edit-chained) → out/cat/
| file | pose | size |
|---|---|---|
| cat_idle.png | standing, as reference | 256 |
| cat_run1.png | running, legs stretched out (front forward, back back) | 256 |
| cat_run2.png | running, legs bunched under body | 256 |
| cat_jump.png | leaping upward, body stretched diagonally up-right, front paws reaching | 256 |
| cat_fall.png | falling, paws spread down, ears back, surprised | 256 |
| cat_hurt.png | dizzy/knocked, spiral eyes, sitting flat | 256 |
| cat_swim.png | swimming horizontally, eyes squeezed, bubbles none | 256 |
| cat_happy.png | sitting upright, eyes closed happy (^ ^), small blush | 256 |
| cat_climb.png | clinging/climbing, seen from side, paws up on a vertical surface | 256 |
| girlcat.png | NEW character same style: cute white/cream chibi girl cat, pink bow on ear, long eyelashes, sitting facing LEFT, blushing | 256 |
| rivalcat.png | NEW character same style: grumpy orange tabby tomcat, scruffy, standing on four legs facing LEFT | 256 |

## Batch B — creatures → out/creatures/
| file | description | size |
|---|---|---|
| bulldog_walk1.png | round chubby grumpy grey bulldog, cute not scary, walking (legs apart), facing right | 256 |
| bulldog_walk2.png | same dog (edit-chained), legs together | 256 |
| bulldog_bark.png | same dog, barking, mouth open | 256 |
| mouse_run1.png | tiny cute grey mouse, big round ears, pink tail, running facing right | 128 |
| mouse_run2.png | same mouse, other leg phase | 128 |
| mouse_peek.png | same mouse, front view head and paws peeking up | 128 |
| goldfish.png | cute round orange goldfish facing right | 128 |
| eel.png | cute but mischievous electric eel, yellow-green with lightning-bolt markings, horizontal facing right | 256 |
| spider.png | big round fuzzy cute purple spider, big eyes, front view, legs out | 256 |
| canary.png | cute round yellow canary bird, side view facing right, wings down | 128 |
| canary_fly.png | same bird, wings up flapping | 128 |
| sleepdog.png | cute round brown puppy-dog lying asleep, eyes closed, "z" not drawn, side view facing right | 256 |
| angrydog.png | same dog awake, standing, angry, facing right | 256 |
| cupid.png | cute chubby cherub cupid kitten with tiny wings and a little bow, flying, facing right | 192 |
| broom.png | anthropomorphic cute broom with mischievous face, upright, bristles at bottom | 256 |

## Batch C — props & items → out/props/
| file | description | size |
|---|---|---|
| shoe.png | red sneaker | 96 |
| boot.png | brown boot | 96 |
| clock.png | alarm clock | 96 |
| phone.png | retro rotary phone | 96 |
| book.png | closed book tilted | 96 |
| fishbowl.png | round glass fishbowl with water, empty (no fish), front view | 256 |
| table.png | small wooden table, side/front view | 320 |
| trashcan.png | metal trash can with lid, cartoon | 192 |
| fence.png | wide wooden backyard fence segment, ~4:1 wide, planks, front view | 640 |
| window_closed.png | apartment window, closed, dark glass with curtains, front view, ~3:4 | 160 |
| window_open.png | same window (edit-chained), open, warm yellow light inside | 160 |
| window_love.png | same window open with pink heart-shaped glow | 160 |
| shelf.png | long wooden bookshelf plank, very wide (~8:1) | 480 |
| books_row.png | a row of colourful books standing upright, ~4:1 | 320 |
| fernpot.png | fern in a cute pot | 128 |
| cheese.png | giant wedge/block of swiss cheese with several round holes, front view, ~3:2 | 640 |
| birdcage.png | golden round birdcage, empty, door closed | 256 |
| dish_full.png | dog food bowl full of kibble | 128 |
| dish_empty.png | same bowl empty | 128 |
| heart.png | glossy pink-red heart, cute | 96 |
| heart_broken.png | same heart cracked in two, slightly grey | 96 |
| gift.png | cute wrapped present with a bow, cyan box magenta ribbon | 96 |
| shirt.png | small laundry shirt hanging (clothespins on top) | 128 |
| sock.png | striped sock hanging | 96 |
| pants.png | pair of pants hanging | 128 |
| pebbles.png | strip of aquarium pebbles and small plants, very wide (~8:1) | 640 |
| bubble.png | single translucent soap/air bubble | 64 |
| sparkle.png | 4-point star sparkle, white-yellow | 64 |
| pawprint.png | small cat pawprint, dark | 48 |
| moon.png | cute smiling crescent moon | 192 |

## Batch D — backgrounds (opaque JPG 1280x720, NO characters, NO text) → out/bg/
| file | description |
|---|---|
| bg_alley.jpg | night city alley: starry purple-navy sky top 20%, a big flat-on brick apartment wall filling the middle (plain brick, NO windows — windows are placed in code), ground pavement band in the bottom 12%. Flat front-on view, cute cel-shaded, soft gradients |
| bg_title.jpg | cozy night rooftops skyline with a big moon, cute, space in centre for a logo |
| bg_livingroom.jpg | cozy living room interior, flat side view, blue patterned wallpaper, wooden floor in bottom 12%, empty (no furniture except a rug and picture frames on wall); an open window at the far left edge |
| bg_underwater.jpg | inside a fishbowl underwater: soft aqua gradient, light rays from top, curved glass edges at the sides, empty |
| bg_library.jpg | cozy study room, green wallpaper, wooden floor bottom 12%, empty walls, window at far left |
| bg_kitchen.jpg | cute kitchen, yellow checkered tiles, floor bottom 12%, empty middle, window at far left |
| bg_bedroom.jpg | cute pink bedroom, floor bottom 12%, empty middle, window at far left |
| bg_dogroom.jpg | cute lavender laundry/den room, floor bottom 12%, empty middle, window at far left |
| bg_love.jpg | dreamy pink-magenta night sky with stars, clouds and a big soft moon, romantic, empty |
