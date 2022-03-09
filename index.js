const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./consts')
isLoaded = false
let data = {}
const axios = require('axios').default;

async function getUser(partic) {
    isLoaded = false
    try {
        const response = await axios.get('http://www.boredapi.com/api/activity', {
            params: {
                participants: partic || 1
            }
        });
        data = response.data
    } catch (error) {
        console.error(error);
    }
    finally {
        isLoaded = true
    }
}
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.replyWithHTML(`Welcome
You can find a random activity via /activity`
))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.command('activity', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>participants</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('1', '1'), Markup.button.callback('2', '2')],
                [Markup.button.callback('3', '3'), Markup.button.callback('4', '4')],
            ]
        ))
    } catch (error) {
        console.error(error);

    }
})
function activityHandler(name) {
    bot.action(name, async (ctx) => {
        try {
            await getUser(name)
            if (isLoaded) {
                ctx.reply(data.activity)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            await ctx.answerCbQuery()
        }
    })
}

activityHandler('1')
activityHandler('2')
activityHandler('3')
activityHandler('4')


bot.help((ctx) => ctx.reply(text.commands))
bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))