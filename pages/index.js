import Container from "../components/Container";
import classes from "../styles/Home.module.css";
import getConfig from "next/config";
import Event from "../components/Event.js";
import AdminCard from "../components/AdminCard.js";
import path from "path";
import fs from "fs";
import React, { useState } from "react";
import Image from "next/image";

import ReCAPTCHA from "react-google-recaptcha";

export default function Home({ events, admins, fileNames }) {
  const [mainImage, setMainImage] = useState(fileNames[0]);
  const { publicRuntimeConfig } = getConfig();

  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleChangeImage = (e) => {
    setMainImage(e.target.alt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: title,
        email: email,
        message: message,
      };
      await fetch(`${publicRuntimeConfig.CREATE_MESSAGE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((res) => console.log(res))
        .catch((err) => console.log("Errro!", err));
    } catch (error) {
      alert(error?.message || "Something went wrong");
    } finally {
      setTitle("");
      setEmail("");
    }
  };

  const onReCAPTCHAChange = () => {
    setDisabled(false);
  };

  return (
    <Container>
      <div className={classes.home}>
        <section className={classes.hero}>
          <h1>Gazi Üniversitesi</h1>
          <p>Bilgisayar Mühendisliği Topluluğu</p>
        </section>

        <section id="gallery" className={classes.gallery}>
          <div className={classes.gallery__main}>
            <Image
              src={`/images/gallery/${mainImage}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={classes.gallery__others}>
            <ul className={classes.gallery__others__list}>
              {fileNames.map((image) => (
                <li key={image} onClick={handleChangeImage}>
                  <Image
                    src={`/images/gallery/${image}`}
                    layout="fill"
                    objectFit="cover"
                    alt={image}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {events.length > 0 && (
          <section id="events" className={classes.events}>
            <div className={classes.section__header}>
              <h2>Yaklaşan Etkinlikler</h2>
            </div>
            <ul className={classes.events__list}>
              {events
                .filter((el) => el.happened === false)
                .map((event) => (
                  <Event key={event._id} event={event} />
                ))}
            </ul>
          </section>
        )}

        <section className={classes.building}>
          <Image
            src="/images/strokd.svg"
            layout="fill"
            objectFit="contain"
            alt="building of gazi university"
          />
        </section>

        <section id="community" className={classes.community}>
          <div className={classes.section__header}>
            <h2>Topluluk Hakkında</h2>
          </div>

          <div className={classes.community__text}>
            <p>
              Gazi Bilgisayar Mühendisliği Topluluğu 0000 yılında kurulup...
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              quis maximus nunc. Nunc nec convallis magna. Nam fermentum purus
              ut convallis scelerisque. Suspendisse tincidunt ligula facilisis,
              faucibus erat non, congue arcu. Fusce et vulputate augue, quis
              imperdiet mauris.
            </p>
          </div>
        </section>
        <section className={classes.admins}>
          <div className={classes.section__header}>
            <h2>Yönetim</h2>
          </div>
          <ul className={classes.admins__list}>
            {admins.map((admin) => (
              <AdminCard key={admin._id} admin={admin} />
            ))}
          </ul>
        </section>
        <section id="ask" className={classes.ask}>
          <div className={classes.section__header}>
            <h2>Bize Sor</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <ReCAPTCHA
              sitekey="6Lelr00dAAAAABsGdIrh6bkyhPnMoYibu0r6SRBt"
              onChange={onReCAPTCHAChange}
            />

            <div id={classes.mess} className={classes.inputbox}>
              <label>Mesaj</label>
              <textarea
                type="text"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div id={classes.emai} className={classes.inputbox}>
              <label>
                E-mail{" "}
                <span className={classes.mail}>
                  (Cevap mail olarak iletilecektir.)
                </span>
              </label>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div id={classes.titl} className={classes.inputbox}>
              <label>Konu</label>
              <input type="text" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <button type="submit" disabled={disabled}>
              Gönder
            </button>
          </form>
        </section>
      </div>
    </Container>
  );
}

export const getStaticProps = async () => {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(`${publicRuntimeConfig.GET_EVENTS}`);
  const events = await res.json();

  const adminsres = await fetch(`${publicRuntimeConfig.GET_ADMINS}`);
  const admins = await adminsres.json();

  const directory = path.join(process.cwd(), "public", "images", "gallery");
  const fileNames = fs.readdirSync(directory);

  return {
    props: {
      events,
      admins,
      fileNames,
    },
  };
};
