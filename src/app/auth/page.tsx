import Image from "next/image";
import { AuthStyles } from "@/styles/pages/AuthStyles";
import Logo_Crew from "@public/img/logo/logo_crew.png";
import Background_Image from "@public/img/login/one_piece.jpg";
import LoginForm from "@/components/forms/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <main className="main">
      <div style={AuthStyles.container}>
        <div style={AuthStyles.imageWrapper}>
          <Image
            src={Background_Image}
            alt="One Piece Background"
            fill
            priority
            quality={100}
            style={AuthStyles.image}
          />
          <div style={AuthStyles.logoWrapper}>
            <Image
              src={Logo_Crew}
              alt="Logo Crew"
              width={80}
              height={80}
              style={AuthStyles.logo}
            />
          </div>
          <div style={AuthStyles.textWrapper}>
            <h1 style={AuthStyles.title}>Crew</h1>
            <p style={AuthStyles.subtitle}>Customer Relationship Management</p>
          </div>
        </div>

        <div style={AuthStyles.formContainer}>
          <div style={AuthStyles.wrapper}>
            <h2 style={AuthStyles.title}>LOGIN</h2>
            <p
              style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Welcome on Board please connect to use the CRM
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
