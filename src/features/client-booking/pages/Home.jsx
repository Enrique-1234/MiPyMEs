import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Navbar } from '../../../components/common/Navbar/Navbar';

const Container = styled.div`
  padding-top: 70px;
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 5rem 2rem 4rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
`;

const Badge = styled.span`
  display: inline-block;
  background: rgba(37, 99, 235, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.35rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSoft};
  max-width: 620px;
  margin: 0 auto 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.75rem;
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -6px rgba(0,0,0,0.08);
  }

  h3 { margin-bottom: 0.5rem; }
  p { font-size: 0.875rem; color: ${({ theme }) => theme.colors.textSoft}; }
`;

export const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Container ref={heroRef}>
      <Navbar />
      <Hero>
        <Badge className="gsap-hero">📍 Plataforma para Nicolás Romero y Edomex</Badge>
        <Title className="gsap-hero">
          Gestiona tus citas y reservas <span>AlPunto</span>
        </Title>
        <Description className="gsap-hero">
          La solución integral para Barberías, Restaurantes, Salones de Eventos y Comunidades.
        </Description>
      </Hero>

      <Grid className="gsap-hero">
        <Card>
          <h3>💈 Barberías & Estéticas</h3>
          <p>Agenda de cortes, tintes y selección de barberos con precios en MXN.</p>
        </Card>
        <Card>
          <h3>🍽️ Restaurantes</h3>
          <p>Mapa interactivo de mesas con selector de terrazas y zonas principales.</p>
        </Card>
        <Card>
          <h3>🎉 Salones de Eventos</h3>
          <p>Cotizaciones de paquetes completos para XV años, bodas y bautizos.</p>
        </Card>
        <Card>
          <h3>⛪ Iglesias & Comunidades</h3>
          <p>Control de aforo para servicios dominicales y actividades comunitarias.</p>
        </Card>
      </Grid>
    </Container>
  );
};