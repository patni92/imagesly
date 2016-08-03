module.exports = {
    index: function(req, res) {
        var view = {
            images: [
            {
                src: "http://2.bp.blogspot.com/-pATX0YgNSFs/VP-82AQKcuI/AAAAAAAALSU/Vet9e7Qsjjw/s1600/Cat-hd-wallpapers.jpg",
            },
             {
                src: "http://www.petdrugsonline.co.uk/images/page-headers/cats-master-header",
            },
             {
                src: "http://www.bharatint.com/img/categories/our-cat-shop-image.png",
            },
             {
                src: "http://www.rmaca.org/wp-content/uploads/2016/05/Cat-laying-on-his-back-on-sofa.jpg",
            },
             {
                src: "http://cats.yourwildlife.org/wp-content/uploads/cat-tracker.jpg",
            },
             {
                src: "http://bigcatrescue.org/wp-content/uploads/wp_photo_seller/14/watermark_TigerPhoto_JV007.jpg",
            },
             {
                src: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Ragdoll_Kater,_drei_Jahre_alt,_RAG_n_21_seal-tabby-colourpoint,_Januar_2015.JPG",
            },

        ]

        };
        res.render("index", view);
    }
};
