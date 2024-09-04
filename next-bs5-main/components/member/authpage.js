import React, { useState } from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import styles from './AuthPage.module.scss';
import GoogleLogo from '@/components/icons/google-logo';

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.formContent}>
          <h2 className={styles.title}>
            {isLoginForm ? '登入' : '註冊'}
          </h2>
          <button className={styles.googleButton}>
            <GoogleLogo />
            快速{isLoginForm ? '登入' : '註冊'}
          </button>
          <div className={styles.divider}>或</div>
          {isLoginForm ? <LoginForm /> : <RegisterForm />}
          <p className={styles.switchPrompt}>
            {isLoginForm ? '還沒有帳號？' : '已經有帳號？'}
            <button onClick={toggleForm} className={styles.switchButton}>
              {isLoginForm ? '註冊新帳號' : '登入'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;