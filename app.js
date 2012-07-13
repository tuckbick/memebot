var Bot = new require('./node_modules/TuckBot/TuckBot').TuckBot,
    db = require('./db').db

function MemeBot(server, nick, opt) {

    var self = this,
        bot = new Bot(server, nick, opt);

    self.doHelp = function(from, args, info) {
        var msg = 'kittybot 3000\n'
                + 'halp : show this text\n'
                + 'save <keyword> <meme> : store a meme\n'
                + 'find <keyword> : retrieve a meme\n'
                + 'list : list all saved memes\n'
                + 'del : delete a specific meme\n'
                + 'pet : talk privately to kitty'
            ;
        bot.reply(from, msg, info);
    }

    bot.api = {

        '?' : self.doHelp,
        halp: self.doHelp,

        save : function(from, args, info) {

            if (!args || !args.length) {
                bot.reply(from, '!!! wrong syntax, meow', info);
                return;
            }

            args[0] = args[0].trim();
            if (args[0] == '') {
                bot.reply(from, '!!! srsly? an empty string?', info);
                return;
            }

            db.Meme.find({ where: {keyword: args[0]} })

                .success(function(meme) {

                    if (!!meme) {
                        bot.reply(from, '!!! umm, use a different keyword', info);
                        return;
                    }

                    db.Meme.create({
                        keyword: args[0],
                        value: args[1]
                    })
                        .success(function(meme) {
                            bot.reply(from, 'yum! - thx', info);
                        })
                });
        },

        find : function(from, args, info) {

            if (!args.length) {
                bot.reply(from, '!!! wrong syntax, meow', info);
                return;
            }

            args[0] = args[0].trim();
            if (args[0] == '') {
                bot.reply(from, '!!! srsly? an empty string?', info);
                return;
            }

            db.Meme.find({ where: {keyword: args[0]} })

                .success(function(meme) {
                    if (!meme) {
                        bot.reply(from, 'no meme found', info);
                        return;
                    }
                    bot.reply(from, meme.value, info);
                })
        },

        list : function(from, args, info) {

            db.Meme.findAll()

                .success(function(memes) {
                    if (!memes.length) {
                        bot.reply(from, 'no memes found', info);
                        return;
                    }
                    var msg = memes.length + ' found\n';
                    for (var i = 0; i < memes.length; i+=1) {
                        msg += memes[i].keyword + ' - ' + memes[i].value + '\n';
                    }
                    bot.reply(from, msg, info);
                })
        },

        del : function(from, args, info) {

            if (!args.length) {
                bot.reply(from, '!!! wrong syntax, meow', info);
                return;
            }

            args[0] = args[0].trim();
            if (args[0] == '') {
                bot.reply(from, '!!! srsly? an empty string?', info);
                return;
            }

            db.Meme.find({ where: {keyword: args[0]} })

                .success(function(meme) {
                    if (!meme) {
                        bot.reply(from, 'no meme found', info);
                        return;
                    }

                    meme.destroy().success(function() {
                        bot.reply(from, 'huzzah, it\'s gone now', info);
                    })
                })

        },

        pet : function(from, args, info) {
            info.args[0] = from;
            bot.reply(from, 'meow', info);
        }

    }

}







var cat = new MemeBot('irc.freenode.net', '', {
    channels: [''],
    debug: true
})